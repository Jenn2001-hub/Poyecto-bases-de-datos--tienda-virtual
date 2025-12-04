import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Loading from '../shared/Loading';
import OrderService from '../../services/OrderService';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await OrderService.getOrderById(id);

        const normalized = {
          id: data.id_pedido ?? data.id ?? Number(id),
          fechaPedido: data.fecha_pedido ?? data.fechaPedido,
          total: Number(data.total ?? 0),
          estado: data.estado ?? 'pendiente',
          cliente: data.cliente,
          items: Array.isArray(data.items) ? data.items : [],
        };

        // Seguridad básica: el pedido debe pertenecer al usuario autenticado
        if (
          user &&
          normalized.cliente &&
          normalized.cliente.id_cliente &&
          normalized.cliente.id_cliente !==
            (user.id || user.id_cliente || user.idCliente)
        ) {
          setError('No tienes permiso para ver este pedido');
          setOrder(null);
        } else {
          setOrder(normalized);
        }
      } catch (err) {
        console.error('Error fetching order detail:', err);
        setError('Error al cargar el detalle del pedido');
        notify('Error al cargar el detalle del pedido', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, user, notify]);

  if (loading) return <Loading />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order) return <div className="alert alert-warning">Pedido no encontrado</div>;

  const { cliente, items } = order;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalle del Pedido #{order.id}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/orders')}>
          Volver a Mis Pedidos
        </Button>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <span>Información del Pedido</span>
                <Badge bg={getStatusBadgeColor(order.estado)}>
                  {order.estado.toUpperCase()}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Fecha:</strong>{' '}
                {order.fechaPedido
                  ? new Date(order.fechaPedido).toLocaleString()
                  : 'N/D'}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>
              {cliente && (
                <>
                  <p>
                    <strong>Cliente:</strong> {cliente.nombre}
                  </p>
                  <p>
                    <strong>Correo:</strong> {cliente.correo}
                  </p>
                  {cliente.telefono && (
                    <p>
                      <strong>Teléfono:</strong> {cliente.telefono}
                    </p>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-12">
          <Card>
            <Card.Header>Productos del Pedido</Card.Header>
            <Card.Body>
              {items.length === 0 ? (
                <div className="alert alert-info">
                  Este pedido no tiene productos asociados.
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id_detalle ?? item.id}>
                        <td>{item.nombre}</td>
                        <td>${Number(item.precio_unitario ?? 0).toFixed(2)}</td>
                        <td>{item.cantidad}</td>
                        <td>${Number(item.subtotal ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

const getStatusBadgeColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pendiente':
      return 'warning';
    case 'enviado':
      return 'info';
    case 'completado':
      return 'success';
    case 'cancelado':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default OrderDetail;
