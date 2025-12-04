import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onRemove, onQuantityChange }) => {

  // --- Corrección principal ---
  const basePrice = Number(item.product.precio ?? item.product.precioBase ?? 0);
  const customization = Number(item.customization?.precioExtra ?? 0);

  const unitPrice = basePrice + customization;
  const totalPrice = unitPrice * item.quantity;

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={item.product.imagenes?.[0]?.url || '/assets/placeholder-product.jpg'}
            alt={item.product.nombre}
            style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
            className="rounded"
          />
          <div>
            <Link to={`/products/${item.product.id}`} className="text-decoration-none">
              <h6 className="mb-1">{item.product.nombre}</h6>
            </Link>

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
        </div>
      </td>

      <td>${unitPrice.toFixed(2)}</td>

      <td>
        <Form.Control
          type="number"
          min="1"
          max="10"
          value={item.quantity}
          onChange={(e) => onQuantityChange(parseInt(e.target.value))}
          style={{ width: '70px' }}
        />
      </td>

      <td>${totalPrice.toFixed(2)}</td>

      <td>
        <Button 
          variant="danger" 
          size="sm"
          onClick={onRemove}
        >
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default CartItem;
