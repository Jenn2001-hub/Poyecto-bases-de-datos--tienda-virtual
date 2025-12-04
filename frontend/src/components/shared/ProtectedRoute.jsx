import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { notify } = useNotifications();
  const location = useLocation();

  if (!isAuthenticated) {
    notify('Debes iniciar sesión para acceder a esta página', 'warning');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.rol !== 'admin') {
    notify('No tienes permisos para acceder a esta sección', 'error');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;