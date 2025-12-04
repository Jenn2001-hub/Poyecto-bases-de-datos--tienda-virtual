// src/components/cart/Cart.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import CartItem from './CartItem';
import PaymentStrategy from '../../utils/PaymentStrategy';
import OrderService from '../../services/OrderService';
import './Cart.css'; // Crea este archivo para estilos personalizados

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, calculateTotal, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [processing, setProcessing] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      notify('Debes iniciar sesión para continuar', 'warning');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setShowCheckoutModal(true);
  };

  const confirmCheckout = async () => {
    setProcessing(true);
    try {
      const strategy = PaymentStrategy.getStrategy(paymentMethod);
      const success = await strategy.pagar(calculateTotal());
      
      if (!success) {
        throw new Error('El pago no pudo completarse');
      }

      // Construimos el payload para el backend
      const orderData = {
        userId: user?.id || user?.id_cliente || user?.idCliente,
        items: cart,
        paymentMethod,
        total: calculateTotal(),
      };

      if (!orderData.userId) {
        throw new Error('No se encontró el usuario para asociar el pedido');
      }

      await OrderService.createOrder(orderData);

      notify('Pedido realizado con éxito', 'success');
      clearCart();
      navigate('/orders');
    } catch (error) {
      notify(error.message || 'Error al procesar el pedido', 'error');
    } finally {
      setProcessing(false);
      setShowCheckoutModal(false);
    }
  };

  if (itemCount === 0) {
    return (
      <div className="container my-5 text-center empty-cart">
        <img 
          src="/assets/empty-cart.png" 
          alt="Carrito vacío" 
          style={{ maxHeight: '200px', marginBottom: '20px' }}
        />
        <h2>Tu carrito está vacío</h2>
        <p className="text-muted mb-4">Explora nuestros productos y encuentra algo que te encante.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Ir al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="container my-5 cart-container">
      <h2 className="mb-4 text-center">Tu Carrito de Compras</h2>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="cart-table-container">
            <Table striped bordered hover className="cart-table">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <CartItem
                    key={`${item.product.id}-${index}`}
                    item={item}
                    onRemove={() => removeFromCart(item.product.id, item.customization)}
                    onQuantityChange={(qty) => updateQuantity(item.product.id, qty, item.customization)}
                  />
                ))}
              </tbody>
            </Table>
          </div>
          
          <div className="d-flex justify-content-end mt-3">
            <Button 
              variant="outline-danger" 
              onClick={clearCart}
              disabled={processing}
            >
              Vaciar Carrito
            </Button>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card checkout-summary">
            <div className="card-body">
              <h5 className="card-title">Resumen del Pedido</h5>
              
              <div className="order-summary">
                {cart.map((item, index) => (
                  <div key={`summary-${item.product.id}-${index}`} className="order-item">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="mb-1">
                          {item.product.nombre} x {item.quantity}
                        </p>
                        {item.customization && (
                          <small className="text-muted customization-details">
                            {Object.entries(item.customization)
                              .filter(([key]) => !['precioExtra', 'accessories'].includes(key))
                              .map(([key, value]) => `${key}: ${value?.nombre || value}`)
                              .join(', ')}
                            {item.customization.accessories?.length > 0 && (
                              <span>, Accesorios: {item.customization.accessories.map(a => a.nombre).join(', ')}</span>
                            )}
                          </small>
                        )}
                      </div>
                      <div className="item-price">
                        ${(
                          (item.product.precioBase + (item.customization?.precioExtra || 0)) * item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3 total-section">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <Form.Group className="mb-3 payment-method">
                <Form.Label>Método de Pago:</Form.Label>
                <Form.Select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processing}
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="paypal">PayPal</option>
                  <option value="contraentrega">Contra Entrega</option>
                </Form.Select>
              </Form.Group>

              <Button 
                variant="primary" 
                className="w-100 py-3 checkout-button"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : 'Realizar Pedido'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showCheckoutModal} onHide={() => !processing && setShowCheckoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas completar el pedido por <strong>${calculateTotal().toFixed(2)}</strong>?</p>
          <p>Método de pago: {getPaymentMethodName(paymentMethod)}</p>
          
          <div className="order-summary-modal">
            {cart.map((item, index) => (
              <div key={`modal-summary-${item.product.id}-${index}`} className="mb-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{item.product.nombre} x {item.quantity}</strong>
                    {item.customization && (
                      <div className="text-muted small">
                        {Object.entries(item.customization)
                          .filter(([key]) => !['precioExtra', 'accessories'].includes(key))
                          .map(([key, value]) => (
                            <div key={key}>
                              <span className="text-capitalize">{key}: </span>
                              <span>{value?.nombre || value}</span>
                            </div>
                          ))}
                        {item.customization.accessories?.length > 0 && (
                          <div>
                            <span>Accesorios: </span>
                            <span>{item.customization.accessories.map(a => a.nombre).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    ${((item.product.precioBase + (item.customization?.precioExtra || 0)) * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCheckoutModal(false)}
            disabled={processing}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmCheckout}
            disabled={processing}
          >
            Confirmar Pedido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const getPaymentMethodName = (method) => {
  switch (method) {
    case 'tarjeta': return 'Tarjeta de Crédito/Débito';
    case 'paypal': return 'PayPal';
    case 'contraentrega': return 'Contra Entrega';
    default: return method;
  }
};

export default Cart;
