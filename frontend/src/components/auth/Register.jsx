import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    telefono: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.contrasena !== formData.confirmPassword) {
      notify('Las contraseñas no coinciden', 'error');
      return;
    }

    if (!formData.nombre || !formData.correo || !formData.contrasena) {
      notify('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    if (formData.contrasena.length < 6) {
      notify('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    try {
      // Remover confirmPassword antes de enviar
      const { confirmPassword, ...userData } = formData;

      // Llamar a la función register del contexto
      const result = await register(userData);

      console.log("Resultado del registro:", result);

      // Mostrar notificación de éxito
      notify('Registro exitoso. ¡Bienvenido!', 'success');
      
      // Redirigir al login (o a home si el registro automáticamente loguea)
      navigate('/login');
      
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Ocurrió un error al registrarte. Inténtalo de nuevo.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      // Casos específicos
      if (errorMessage.includes('ya está registrado') || 
          errorMessage.includes('El correo ya está registrado')) {
        errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
      }
      
      notify(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Crear cuenta</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="correo" className="form-label">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    className="form-control"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    className="form-control"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="contrasena" className="form-label">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    className="form-control"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <small className="text-muted">Mínimo 6 caracteres</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registrando...
                    </>
                  ) : 'Registrarse'}
                </button>
              </form>
              
              <div className="mt-3 text-center">
                <p className="mb-0">
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;