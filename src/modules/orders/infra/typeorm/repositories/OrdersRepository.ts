import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormOrderRepository: Repository<Order>;

  constructor() {
    this.ormOrderRepository = getRepository(Order);
  }

  public async create(data: ICreateOrderDTO): Promise<Order> {
    const order = this.ormOrderRepository.create(data);

    await this.ormOrderRepository.save(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormOrderRepository.findOne({
      where: {
        id,
      },
      relations: ['customer', 'order_products'],
    });

    delete order?.created_at;
    delete order?.updated_at;
    return order;
  }
}

export default OrdersRepository;
