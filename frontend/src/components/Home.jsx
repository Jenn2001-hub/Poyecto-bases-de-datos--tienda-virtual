import React from 'react';
import { Link } from 'react-router-dom';
import Categories from './Categories';

const Home = () => {
  return (
    <div>
      <section className="hero-section text-center text-white py-5">
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-4">Hilos y Sueños</h1>
          <p className="lead mb-5">Artesanías tejidas con amor y dedicación</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/products" className="btn btn-light btn-lg px-4">
              Ver Catálogo
            </Link>
            <Link to="/categories" className="btn btn-outline-light btn-lg px-4">
              Explorar Categorías
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section py-5 bg-light">
        <div className="container py-4">
          <h2 className="text-center mb-5">Nuestra Historia</h2>
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <p className="lead">
                Hilos y Sueños nació en 2023 cuando Jennifer, una apasionada por el crochet, decidió compartir sus creaciones con el mundo. 
                Lo que comenzó como un pequeño emprendimiento desde su hogar en Pereira, hoy se ha convertido en una comunidad de amantes 
                de las artesanías tejidas.
              </p>
            </div>
            <div className="col-md-6">
              <p className="lead">
                Hoy somos un equipo de artesanas colombianas comprometidas con preservar las técnicas tradicionales del crochet mientras 
                innovamos con nuevos diseños. Cada producto cuenta una historia y está hecho para durar generaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Categories />
    </div>
  );
};

export default Home;