import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';

const ProductCustomizer = ({ 
  product, 
  show,
  handleClose,
  onCustomizationChange
}) => {
  const [customization, setCustomization] = useState({
    color: null,
    size: null,
    material: null,
    accessories: [],
    precioExtra: 0
  });

  useEffect(() => {
    if (product && product.personalizacion) {
      const initialCustomization = {
        color: product.personalizacion.colores?.[0] || null,
        size: product.personalizacion.tamaños?.[0] || null,
        material: product.personalizacion.materiales?.[0] || null,
        accessories: [],
        precioExtra: 0
      };
      setCustomization(initialCustomization);
      onCustomizationChange?.(initialCustomization);
    }
  }, [product, show, onCustomizationChange]);

  const calculateTotalExtra = (custom) => {
    let total = 0;
    if (custom.color?.precioExtra) total += custom.color.precioExtra;
    if (custom.size?.precioExtra) total += custom.size.precioExtra;
    if (custom.material?.precioExtra) total += custom.material.precioExtra;
    if (custom.accessories?.length > 0) {
      total += custom.accessories.reduce((sum, acc) => sum + (acc.precioExtra || 0), 0);
    }
    return total;
  };

  const handleSelectChange = (type, value) => {
    const newCustomization = {
      ...customization,
      [type]: value
    };
    newCustomization.precioExtra = calculateTotalExtra(newCustomization);
    setCustomization(newCustomization);
    onCustomizationChange?.(newCustomization);
  };

  const handleAccessoryToggle = (accessory) => {
    const isSelected = customization.accessories.some(a => a.nombre === accessory.nombre);
    let newAccessories;
    
    if (isSelected) {
      newAccessories = customization.accessories.filter(a => a.nombre !== accessory.nombre);
    } else {
      newAccessories = [...customization.accessories, accessory];
    }
    
    const newCustomization = {
      ...customization,
      accessories: newAccessories
    };
    newCustomization.precioExtra = calculateTotalExtra(newCustomization);
    setCustomization(newCustomization);
    onCustomizationChange?.(newCustomization);
  };

  if (!product || !product.personalizacion) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Personaliza tu {product.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Color */}
          {product.personalizacion.colores?.length > 0 && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Color</Form.Label>
              <Col sm={9}>
                <Form.Select 
                  value={customization.color?.nombre || ''}
                  onChange={(e) => {
                    const selected = product.personalizacion.colores.find(
                      c => c.nombre === e.target.value
                    );
                    handleSelectChange('color', selected);
                  }}
                >
                  {product.personalizacion.colores.map((color, index) => (
                    <option key={color?.nombre || `color-${index}`} value={color?.nombre || ''}>
                      {color?.nombre} {color?.precioExtra ? `(+$${color.precioExtra.toLocaleString()})` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          )}

          {/* Tamaño */}
          {product.personalizacion.tamaños?.length > 0 && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Tamaño</Form.Label>
              <Col sm={9}>
                <Form.Select 
                  value={customization.size?.nombre || ''}
                  onChange={(e) => {
                    const selected = product.personalizacion.tamaños.find(
                      t => t.nombre === e.target.value
                    );
                    handleSelectChange('size', selected);
                  }}
                >
                  {product.personalizacion.tamaños.map((size, index) => (
                    <option key={size?.nombre || `size-${index}`} value={size?.nombre || ''}>
                      {size?.nombre} {size?.precioExtra ? 
                        (size.precioExtra > 0 
                          ? `(+$${size.precioExtra.toLocaleString()})`
                          : `(-$${Math.abs(size.precioExtra).toLocaleString()})`)
                        : ''}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          )}

          {/* Material */}
          {product.personalizacion.materiales?.length > 0 && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Material</Form.Label>
              <Col sm={9}>
                <Form.Select 
                  value={customization.material?.nombre || ''}
                  onChange={(e) => {
                    const selected = product.personalizacion.materiales.find(
                      m => m.nombre === e.target.value
                    );
                    handleSelectChange('material', selected);
                  }}
                >
                  {product.personalizacion.materiales.map((material, index) => (
                    <option key={material?.nombre || `material-${index}`} value={material?.nombre || ''}>
                      {material?.nombre} {material?.precioExtra ? `(+$${material.precioExtra.toLocaleString()})` : ''}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          )}

          {/* Accesorios */}
          {product.personalizacion.accesorios?.length > 0 && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>Accesorios</Form.Label>
              <Col sm={9}>
                <div className="d-flex flex-wrap gap-2">
                  {product.personalizacion.accesorios.map((accessory, index) => (
                    <Button
                      key={accessory?.nombre || `accessory-${index}`}
                      variant={customization.accessories.some(a => a.nombre === accessory.nombre) 
                        ? 'primary' 
                        : 'outline-primary'}
                      onClick={() => handleAccessoryToggle(accessory)}
                      size="sm"
                    >
                      {accessory?.nombre} {accessory?.precioExtra ? `(+$${accessory.precioExtra.toLocaleString()})` : ''}
                    </Button>
                  ))}
                </div>
              </Col>
            </Form.Group>
          )}

          {/* Resumen */}
          <div className="mt-4 p-3 bg-light rounded">
            <h5>Resumen de Personalización</h5>
            {customization.color && <p><strong>Color:</strong> {customization.color.nombre}</p>}
            {customization.size && <p><strong>Tamaño:</strong> {customization.size.nombre}</p>}
            {customization.material && <p><strong>Material:</strong> {customization.material.nombre}</p>}
            
            {customization.accessories?.length > 0 && (
              <>
                <p><strong>Accesorios:</strong></p>
                <ul>
                  {customization.accessories.map((a, index) => (
                    <li key={a?.nombre || `acc-${index}`}>{a.nombre}</li>
                  ))}
                </ul>
              </>
            )}
            
            <h5 className="mt-3">
              Costo adicional: <Badge bg="success">+${customization.precioExtra.toLocaleString()}</Badge>
            </h5>
            <h4 className="mt-2">
              Precio total: <Badge bg="primary">
                ${((product.precioBase || 0) + customization.precioExtra).toLocaleString()}
              </Badge>
            </h4>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Guardar Personalización
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductCustomizer;