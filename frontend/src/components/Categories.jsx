import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../services/ProductService';
import Loading from './shared/Loading';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ProductService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">Nuestras Categorías</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {categories.map(category => (
          <div key={category.id} className="col">
            <Link 
              to={`/category/${category.id}`} 
              className="card text-decoration-none text-dark h-100 hover-shadow"
            >
              <div className="card-body text-center p-4">
                <div className="display-2 mb-3">{category.icon}</div>
                <h3 className="card-title">{category.name}</h3>
                <p className="text-muted">Ver productos</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;