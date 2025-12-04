import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductService from '../services/ProductService';
import ProductCard from './products/ProductCard';
import Loading from './shared/Loading';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, categoryProducts] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getProductsByCategory(parseInt(categoryId))
        ]);
        
        const cat = categories.find(c => c.id === parseInt(categoryId));
        setCategory(cat);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) return <Loading />;
  if (!category) return <div className="alert alert-danger">Categoría no encontrada</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <span className="me-3">{category.icon}</span>
          {category.name}
        </h2>
        <Link to="/categories" className="btn btn-outline-primary">
          Volver a Categorías
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="alert alert-info">
          No hay productos disponibles en esta categoría
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map(product => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;