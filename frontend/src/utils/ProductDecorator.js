export default class ProductDecorator {
  constructor(product, customization) {
    this.product = product;
    this.customization = customization;
  }

  get id() {
    return this.product.id;
  }

  get nombre() {
    return this.product.nombre;
  }

  get descripcion() {
    return `${this.product.descripcion} (Personalizado: ${this.getCustomizationDetails()})`;
  }

  get precioBase() {
    return this.product.precioBase + (this.customization.precioExtra || 0);
  }

  get disponible() {
    return this.product.disponible;
  }

  get imagenes() {
    return this.product.imagenes;
  }

  get categorias() {
    return this.product.categorias;
  }

  getCustomizationDetails() {
    const details = [];
    if (this.customization.color) details.push(`Color: ${this.customization.color.nombre}`);
    if (this.customization.size) details.push(`Tamaño: ${this.customization.size.nombre}`);
    if (this.customization.material) details.push(`Material: ${this.customization.material.nombre}`);
    if (this.customization.accessories?.length > 0) {
      details.push(`Accesorios: ${this.customization.accessories.map(a => a.nombre).join(', ')}`);
    }
    return details.join(', ');
  }

  calcularPrecio() {
    return this.precioBase;
  }
}