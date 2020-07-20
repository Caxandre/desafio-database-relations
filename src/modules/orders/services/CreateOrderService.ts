import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import OrderProducts from '../infra/typeorm/entities/OrdersProducts';
import IOrdersRepository from '../repositories/IOrdersRepository';
import IOrdersProductsRepository from '../repositories/IOrdersProductsRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('OrdersProductsRepository')
    private ordersProductsRepository: IOrdersProductsRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exists');
    }

    const prod_id: any = products.map(pr => pr.id);

    const allById: any = await this.productsRepository.findAllById(prod_id);

    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: allById,
    });

    await this.ordersProductsRepository.create(
      allById.map((pro: any) => {
        const productFinal = products.find(
          productFind => productFind.id === pro.id,
        );
        return {
          order_id: order.id,
          product_id: pro.id,
          price: pro.price,
          quantity: productFinal?.quantity || 0,
        };
      }),
    );

    order.order_products = await this.ordersProductsRepository.findById(
      order.id,
    );
    return order;
  }
}

export default CreateOrderService;
