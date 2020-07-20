import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import IOrdersProductsRepository from '../repositories/IOrdersProductsRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('OrdersProductsRepository')
    private ordersProductsRepository: IOrdersProductsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not find');
    }

    order.order_products = await this.ordersProductsRepository.findById(
      order.id,
    );

    return order;
  }
}

export default FindOrderService;
