import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Hilos y Sueños</h5>
            <p>Artesanías tejidas con amor y dedicación desde 2023.</p>
          </div>
          <div className="col-md-4">
            <h5>Contacto</h5>
            <ul className="list-unstyled">
              <li>Email: info@hilosysueños.com</li>
              <li>Teléfono: +57 3006111724</li>
              <li>Pereira, Colombia</li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="/terms">Términos y Condiciones</a></li>
              <li><a href="/privacy">Política de Privacidad</a></li>
              <li><a href="/about">Sobre Nosotros</a></li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p className="mb-0">© {new Date().getFullYear()} Hilos y Sueños - Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;