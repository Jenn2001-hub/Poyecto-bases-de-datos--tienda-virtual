import ProductDecorator from './ProductDecorator';

class ProductFactory {
  static createProduct(type, baseProduct, customization = null) {
    switch (type) {
      case 'normal':
        return baseProduct;
      case 'personalizado':
        if (!customization) throw new Error('Customization is required for personalized products');
        return new ProductDecorator(baseProduct, customization);
      default:
        throw new Error('Invalid product type');
    }
  }
}

export default ProductFactory;