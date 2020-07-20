import Product from '../../products/infra/typeorm/entities/Product';

export default interface ICreateOrderProductsDTO {
  order_id: string;
  product_id: string;
  price: number;
  quantity: number;
}
