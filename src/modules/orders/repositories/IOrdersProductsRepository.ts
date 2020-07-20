import OrderProduct from '../infra/typeorm/entities/OrdersProducts';

import ICreateOrderProductsDTO from '../dtos/ICreateOrderProductsDTO';

export default interface IOrdersRepository {
  create(data: ICreateOrderProductsDTO): Promise<OrderProduct>;
  findById(id: string): Promise<OrderProduct[]>;
}
