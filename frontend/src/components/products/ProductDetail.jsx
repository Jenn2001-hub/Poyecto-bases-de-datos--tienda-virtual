import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ProductCustomizer from './ProductCustomizer';
import ProductService from '../../services/ProductService';
import Loading from '../shared/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customization, setCustomization] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { notify } = useNotifications();
  const navigate = useNavigate();

  // Mover el cálculo del precio dentro del componente y protegerlo
  const finalPrice = product ? product.precioBase + (customization?.precioExtra || 0) : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(parseInt(id));
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      const finalCustomization = customization || {
        color: product.personalizacion?.colores?.[0] || null,
        size: product.personalizacion?.tamaños?.[0] || null,
        material: product.personalizacion?.materiales?.[0] || null,
        accessories: [],
        precioExtra: 0
      };
      
      addToCart(product, quantity, finalCustomization);
      notify(`${product.nombre} agregado al carrito`, 'success');
      navigate('/cart');
    } catch (error) {
      notify('Error al agregar al carrito', 'error');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert variant="danger" className="container mt-4">Error: {error}</Alert>;
  if (!product) return <Alert variant="warning" className="container mt-4">Producto no encontrado</Alert>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-4">
            <img 
              src={product.imagenes?.[0]?.url || '/assets/placeholder-product.jpg'} 
              className="img-fluid rounded" 
              alt={product.imagenes?.[0]?.descripcion || product.nombre}
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.nombre}</h1>
          <p className="lead">{product.descripcion}</p>
          
          <div className="d-flex align-items-center mb-4">
            <h3 className="text-primary mb-0 me-3">
              ${product.precioBase.toLocaleString('es-CO')}
            </h3>
            {product.disponible ? (
              <span className="badge bg-success">Disponible</span>
            ) : (
              <span className="badge bg-danger">Agotado</span>
            )}
          </div>

          {product.personalizacion && (
            <div className="mb-4">
              <Button 
                variant="outline-primary" 
                onClick={() => setShowCustomizer(true)}
                className="me-2"
              >
                Personalizar Producto
              </Button>
              {customization?.precioExtra > 0 && (
                <span className="text-success">
                  +${customization.precioExtra.toLocaleString('es-CO')} por personalización
                </span>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label me-2">Cantidad:</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              className="form-control d-inline-block" 
              style={{ width: '80px' }}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            />
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleAddToCart}
            disabled={!product.disponible}
            className="w-100 py-3"
          >
            {product.disponible ? 
              `Agregar al Carrito - $${finalPrice.toLocaleString('es-CO')}` : 
              'Producto no disponible'}
          </Button>
        </div>
      </div>

      {product.personalizacion && (
        <ProductCustomizer 
          product={product} 
          show={showCustomizer}
          handleClose={() => setShowCustomizer(false)}
          onCustomizationChange={setCustomization}
        />
      )}
    </div>
  );
};

export default ProductDetail;