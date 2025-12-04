// src/components/products/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import ProductCard from './ProductCard';
import ProductService from '../../services/ProductService';
import Loading from '../shared/Loading';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error obteniendo productos:', err);
        setError(err.message || 'Error obteniendo productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Catálogo de Productos</h2>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {products.length === 0 ? (
        <Alert variant="info">No hay productos disponibles en este momento.</Alert>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
