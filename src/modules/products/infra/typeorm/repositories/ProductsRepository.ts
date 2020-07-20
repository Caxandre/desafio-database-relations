import { getRepository, Repository, In } from 'typeorm';
import AppError from '@shared/errors/AppError';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // const idList = products.map(product => product.id);
    // const orderList = await this.ormRepository.find({ id: In(idList) });

    const orderList = await this.ormRepository.find({
      where: { id: In(products) },
    });

    if (orderList.length == 0) {
      throw new AppError('Products missing.');
    }

    return orderList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const prod_id: any = products.map(pr => pr.id);
    const productsData = await this.findAllById(prod_id);

    const newProducts = productsData.map(productData => {
      const productFind = products.find(
        product => product.id === productData.id,
      );

      if (!productFind) {
        throw new AppError('Product not find');
      }

      if (productData.quantity < productFind.quantity) {
        throw new AppError('Insuficient product quantity');
      }

      const newProduct = productData;
      newProduct.quantity -= productFind.quantity;
      return newProduct;
    });

    await this.ormRepository.save(newProducts);

    return newProducts;
  }
}

export default ProductsRepository;
