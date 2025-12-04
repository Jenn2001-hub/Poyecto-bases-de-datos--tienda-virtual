import React from 'react';

const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">{message}</p>
      </div>
    </div>
  );
};

export default Loading;