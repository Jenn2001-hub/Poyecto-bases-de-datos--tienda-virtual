const AuthService = {
  login: async (email, password) => {
    // Simulación de login
    return Promise.resolve({
      id: 1,
      nombre: 'Usuario Demo',
      correo: email,
      rol: email === 'admin@tienda.com' ? 'admin' : 'user',
      estadoCuenta: 'active'
    });
  },
  
  register: async (userData) => {
    // Simulación de registro
    return Promise.resolve({
      id: Math.floor(Math.random() * 1000),
      ...userData,
      rol: 'user',
      estadoCuenta: 'active'
    });
  },
  
  getUsers: async () => {
    // Para el panel de admin
    return Promise.resolve([
      { id: 1, nombre: 'Admin', correo: 'admin@tienda.com', rol: 'admin', estadoCuenta: 'active' },
      { id: 2, nombre: 'Usuario 1', correo: 'user1@tienda.com', rol: 'user', estadoCuenta: 'active' }
    ]);
  },
  
  requestPasswordReset: async (email) => {
    console.log(`Solicitud de restablecimiento para: ${email}`);
    return Promise.resolve({ success: true });
  },
  
  resetPassword: async (token, newPassword) => {
    console.log(`Restableciendo contraseña con token: ${token}`);
    return Promise.resolve({ success: true });
  }
};

export default AuthService;