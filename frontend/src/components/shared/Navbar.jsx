import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome, FaTags } from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <span className="me-2">🧶</span>Hilos y Sueños
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FaHome className="me-1" /> Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                <FaTags className="me-1" /> Categorías
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Productos
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {user?.rol === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    Mis Pedidos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <FaShoppingCart className="me-1" />
                    Carrito {itemCount > 0 && (
                      <span className="badge bg-light text-primary">{itemCount}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link dropdown-toggle bg-transparent border-0" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <FaUser className="me-1" /> {user?.nombre.split(' ')[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-1" /> Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt className="me-1" /> Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <FaUserPlus className="me-1" /> Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;