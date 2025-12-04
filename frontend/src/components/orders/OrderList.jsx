import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Badge} from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import OrderService from '../../services/OrderService';
import Loading from '../shared/Loading';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { notify } = useNotifications();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId =
          user?.id || user?.id_cliente || user?.idCliente || user?.idUsuario;

        if (!userId) {
          throw new Error('No se encontró el identificador del usuario');
        }

        const data = await OrderService.getOrders(userId);

        const normalized = data.map((o) => ({
          id: o.id_pedido ?? o.id ?? o.idPedido,
          fechaPedido: o.fecha_pedido ?? o.fechaPedido,
          total: Number(o.total ?? 0),
          estado: o.estado ?? 'pendiente',
          itemsCount:
            o.itemsCount ??
            (Array.isArray(o.items) ? o.items.length : undefined) ??
            0,
        }));

        setOrders(normalized);
      } catch (error) {
        setError('Error al cargar los pedidos');
        notify('Error al cargar la lista de pedidos', 'error');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, notify]);

  if (loading) return <Loading />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mis Pedidos</h2>
        <Link to="/products" className="btn btn-outline-primary">
          Seguir Comprando
        </Link>
      </div>
      
      {orders.length === 0 ? (
        <div className="alert alert-info">
          No tienes pedidos registrados. ¡Haz tu primera compra!
        </div>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item 
              key={order.id}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-bold">
                  Pedido #{order.id}
                </div>
                <div className="text-muted">
                  Fecha: {order.fechaPedido ? new Date(order.fechaPedido).toLocaleString() : 'N/D'}
                </div>
                <div className="text-muted">
                  Productos: {order.itemsCount}
                </div>
              </div>
              <div className="text-end">
                <div className="mb-1">
                  <Badge bg={getStatusBadgeColor(order.estado)}>
                    {order.estado.toUpperCase()}
                  </Badge>
                </div>
                <div className="fw-bold">
                  Total: ${order.total.toFixed(2)}
                </div>
                <Link to={`/orders/${order.id}`} className="btn btn-link btn-sm">
                  Ver detalle
                </Link>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

const getStatusBadgeColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pendiente': return 'warning';
    case 'enviado': return 'info';
    case 'completado': return 'success';
    case 'cancelado': return 'danger';
    default: return 'secondary';
  }
};

export default OrderList;
