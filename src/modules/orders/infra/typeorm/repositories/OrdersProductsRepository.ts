import { getRepository, Repository } from 'typeorm';

import IOrdersProductsRepository from '@modules/orders/repositories/IOrdersProductsRepository';
import ICreateOrderProductsDTO from '@modules/orders/dtos/ICreateOrderProductsDTO';
import OrderProduct from '../entities/OrdersProducts';

class OrdersProductsRepository implements IOrdersProductsRepository {
  private ormRepository: Repository<OrderProduct>;

  constructor() {
    this.ormRepository = getRepository(OrderProduct);
  }

  public async create(data: ICreateOrderProductsDTO): Promise<OrderProduct> {
    const orderProduct = this.ormRepository.create(data);

    await this.ormRepository.save(orderProduct);

    delete orderProduct.created_at;
    delete orderProduct.updated_at;

    return orderProduct;
  }

  public async findById(id: string): Promise<OrderProduct[]> {
    const orderProduct = await this.ormRepository.find({
      where: {
        order_id: id,
      },
      select: ['product_id', 'price', 'quantity'],
    });

    return orderProduct;
  }
}

export default OrdersProductsRepository;
