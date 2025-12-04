import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const getPlaceholderImage = (categoryId) => {
    const categoryImages = {
      1: 'https://via.placeholder.com/300x250?text=Amigurumi',
      2: 'https://via.placeholder.com/300x250?text=Ropa',
      3: 'https://via.placeholder.com/300x250?text=Llavero',
      4: 'https://via.placeholder.com/300x250?text=Bolso',
      5: 'https://via.placeholder.com/300x250?text=Hogar',
      6: 'https://via.placeholder.com/300x250?text=Joyeria',
    };
    return (
      categoryImages[categoryId] ||
      'https://via.placeholder.com/300x250?text=Producto'
    );
  };

  const categoryId = product.idCategoria ?? product.categoriaId ?? 0;

  const mainImage =
    (product.imagenes && product.imagenes[0] && product.imagenes[0].url) ||
    getPlaceholderImage(categoryId);

  const price = Number(product.precioBase || 0);

  return (
    <div className="card h-100 product-card shadow-sm">
      <div className="product-card-image-wrapper">
        <img
          src={mainImage}
          alt={product.nombre}
          className="card-img-top product-card-image"
        />
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.nombre}</h5>
        {product.descripcion && (
          <p className="card-text text-muted small">
            {product.descripcion.length > 120
              ? product.descripcion.slice(0, 120) + '...'
              : product.descripcion}
          </p>
        )}
        <div className="mt-auto">
          <p className="price h5 text-primary">
            ${price.toLocaleString('es-CO')}
          </p>
          <Link to={`/products/${product.id}`} className="btn btn-primary w-100">
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
