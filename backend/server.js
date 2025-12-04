// server.js
const http = require('http');
const url = require('url');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const PORT = 3001;

// ===============================================
// UTILIDADES
// ===============================================
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('JSON inválido en el cuerpo de la petición'));
      }
    });
    req.on('error', reject);
  });
}

// ===============================================
// PRODUCTOS - FUNCIONES CORREGIDAS
// ===============================================

// ✅ GET /api/products (con soporte para filtro por categoría)
async function handleGetProducts(req, res) {
  try {
    const parsedUrl = url.parse(req.url, true);
    const categoryId = parsedUrl.query.categoryId;

    let query = `
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio_base,
        p.stock,
        c.id_categoria,
        c.nombre AS categoria
      FROM producto p
      JOIN categoria c ON c.id_categoria = p.id_categoria
    `;
    
    const params = [];
    
    if (categoryId) {
      query += ' WHERE p.id_categoria = ?';
      params.push(categoryId);
    }
    
    const [rows] = await pool.query(query, params);

    // ✅ Mapear campos correctamente para el frontend
    const mappedRows = rows.map(p => ({
      id: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precioBase: p.precio_base,
      stock: p.stock,
      idCategoria: p.id_categoria,
      categoria: p.categoria,
      estado: 'activo',
      imagenes: [
        {
          url: `/assets/products/product-${p.id_producto}.jpg`,
          descripcion: p.nombre
        }
      ]
    }));

    sendJson(res, 200, mappedRows);
  } catch (err) {
    console.error("Error en handleGetProducts:", err);
    sendError(res, 500, "Error obteniendo productos");
  }
}

// ✅ GET /api/products/:id - CORREGIDO
async function handleGetProductById(req, res, id) {
  try {
    // ✅ Validar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return sendError(res, 400, "ID de producto inválido");
    }

    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio_base,
        p.stock,
        c.id_categoria,
        c.nombre AS categoria
      FROM producto p
      JOIN categoria c ON c.id_categoria = p.id_categoria
      WHERE p.id_producto = ?
    `, [id]);

    if (rows.length === 0) {
      return sendError(res, 404, "Producto no encontrado");
    }

    // ✅ Mapear campos correctamente
    const producto = rows[0];
    const mappedProduct = {
      id: producto.id_producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioBase: producto.precio_base,
      stock: producto.stock,
      idCategoria: producto.id_categoria,
      categoria: producto.categoria,
      estado: 'activo',
      imagenes: [
        {
          url: `/assets/products/product-${producto.id_producto}.jpg`,
          descripcion: producto.nombre
        }
      ]
    };

    sendJson(res, 200, mappedProduct);
  } catch (err) {
    console.error("Error en handleGetProductById:", err);
    sendError(res, 500, "Error obteniendo producto");
  }
}

// ===============================================
// CATEGORÍAS - FUNCIONES CORREGIDAS
// ===============================================

// ✅ GET /api/categories
async function handleGetCategories(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT id_categoria, nombre
      FROM categoria
      ORDER BY nombre ASC
    `);

    // ✅ Mapear para el frontend
    const mappedCategories = rows.map(c => ({
      id: c.id_categoria,
      name: c.nombre,
      nombre: c.nombre
    }));

    sendJson(res, 200, mappedCategories);
  } catch (err) {
    console.error("Error en handleGetCategories:", err);
    sendError(res, 500, "Error obteniendo categorías");
  }
}

// ✅ GET /api/categories/:id - NUEVO
async function handleGetCategoryById(req, res, id) {
  try {
    // ✅ Validar que el ID sea un número válido
    if (!id || isNaN(id)) {
      return sendError(res, 400, "ID de categoría inválido");
    }

    const [rows] = await pool.query(
      "SELECT id_categoria, nombre FROM categoria WHERE id_categoria = ?",
      [id]
    );

    if (rows.length === 0) {
      return sendError(res, 404, "Categoría no encontrada");
    }

    // ✅ Mapear para el frontend
    const categoria = rows[0];
    sendJson(res, 200, {
      id: categoria.id_categoria,
      name: categoria.nombre,
      nombre: categoria.nombre
    });
  } catch (err) {
    console.error("Error en handleGetCategoryById:", err);
    sendError(res, 500, "Error obteniendo categoría");
  }
}

// ===============================================
// REGISTRO - MEJORADO CON BCRYPT
// ===============================================
async function handleRegister(req, res) {
  try {
    const body = await parseBody(req);

    // Normalizar campos que vienen del frontend
    const nombre =
      body.nombre ||
      body.nombreCompleto ||
      body.fullName ||
      body.name;

    const correo =
      body.correo ||
      body.email ||
      body.correoElectronico;

    const telefono =
      body.telefono ||
      body.celular ||
      body.phone ||
      null;

    const contrasena =
      body.contrasena ||
      body.contraseña ||
      body.password ||
      body.password1 ||
      body.clave;

    // Validación básica
    if (!nombre || !correo || !contrasena) {
      return sendError(res, 400, 'Faltan datos obligatorios para el registro');
    }

    // Verificar si ya existe CLIENTE con ese correo
    const [existing] = await pool.query(
      'SELECT id_cliente FROM cliente WHERE correo = ?',
      [correo]
    );
    if (existing.length > 0) {
      return sendError(res, 409, 'El correo ya está registrado');
    }

    // ✅ Hashear contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar en tabla CLIENTE
    const [result] = await pool.query(
      `INSERT INTO cliente (nombre, correo, telefono, contrasena)
       VALUES (?,?,?,?)`,
      [nombre, correo, telefono, hashedPassword]
    );

    const newUser = {
      id: result.insertId,
      idCliente: result.insertId,
      nombre,
      correo,
      telefono
    };

    // Insertar también en tabla USUARIO
    await pool.query(
      `INSERT INTO usuario (nombre_usuario, contrasena)
       VALUES (?,?)`,
      [correo, hashedPassword]
    );

    // Respuesta al frontend
    sendJson(res, 201, {
      user: newUser,
      message: 'Registro exitoso',
    });
  } catch (err) {
    console.error('Error en handleRegister:', err);
    sendError(res, 500, 'Error en el registro');
  }
}

// ===============================================
// LOGIN - MEJORADO CON BCRYPT
// ===============================================
// ===============================================
// LOGIN - VERSIÓN HÍBRIDA (soporta ambos tipos)
// ===============================================
async function handleLogin(req, res) {
  try {
    const body = await parseBody(req);
    const email = body.email || body.correo;
    const password = body.password || body.contrasena || body.contraseña;

    if (!email || !password) {
      return sendError(res, 400, 'Email y contraseña son obligatorios');
    }

    const [rows] = await pool.query(
      `SELECT id_cliente, nombre, correo, telefono, contrasena
       FROM cliente
       WHERE correo = ?`,
      [email]
    );

    if (rows.length === 0) {
      return sendError(res, 400, 'Correo o contraseña incorrectos');
    }

    const cliente = rows[0];

    // ✅ LÓGICA HÍBRIDA: Soporta contraseñas hasheadas Y texto plano
    let validPassword = false;

    // Si la contraseña está hasheada (empieza con $2a$ o $2b$)
    if (cliente.contrasena && cliente.contrasena.startsWith('$2')) {
      validPassword = await bcrypt.compare(password, cliente.contrasena);
      
      // Si es válida, ya está todo bien
    } else {
      // Si NO está hasheada, comparar en texto plano (usuarios viejos)
      validPassword = (password === cliente.contrasena);
      
      // 🔄 BONUS: Si el login es exitoso, actualizar a bcrypt automáticamente
      if (validPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          'UPDATE cliente SET contrasena = ? WHERE id_cliente = ?',
          [hashedPassword, cliente.id_cliente]
        );
        console.log(`🔐 Contraseña actualizada a bcrypt para: ${email}`);
      }
    }
    
    if (!validPassword) {
      return sendError(res, 400, 'Correo o contraseña incorrectos');
    }

    sendJson(res, 200, {
      user: {
        id: cliente.id_cliente,
        nombre: cliente.nombre,
        correo: cliente.correo,
        telefono: cliente.telefono,
      }
    });

  } catch (err) {
    console.error('Error en handleLogin:', err);
    sendError(res, 500, 'Error en el login');
  }
}
// ===============================================
// PEDIDOS
// ===============================================

async function handleCreateOrder(req, res) {
  const conn = await pool.getConnection();
  try {
    const body = await parseBody(req);
    const { userId, items, total } = body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      conn.release();
      return sendError(res, 400, 'Datos de pedido incompletos');
    }

    await conn.beginTransaction();

    const estado = 'pagado';

    const computedTotal = typeof total === 'number'
      ? total
      : items.reduce((acc, item) => {
          const price =
            item.precioUnitario ??
            item.precio_unitario ??
            item.product?.precioBase ??
            0;
          const qty = item.cantidad || item.quantity || 1;
          return acc + price * qty;
        }, 0);

    const [pedidoResult] = await conn.query(
      `INSERT INTO pedido (id_cliente, estado, total)
       VALUES (?,?,?)`,
      [userId, estado, computedTotal]
    );

    const idPedido = pedidoResult.insertId;

    for (const item of items) {
      const idProducto = item.idProducto || item.productId || item.product?.id || item.product?.idProducto;
      const cantidad = item.cantidad || item.quantity || 1;
      const precio =
        item.precioUnitario ??
        item.precio_unitario ??
        item.product?.precioBase ??
        0;

      const subtotal = precio * cantidad;

      await conn.query(
        `INSERT INTO detalle_pedido
         (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
         VALUES (?,?,?,?,?)`,
        [idPedido, idProducto, cantidad, precio, subtotal]
      );

      await conn.query(
        `UPDATE producto SET stock = stock - ? WHERE id_producto = ?`,
        [cantidad, idProducto]
      );
    }

    await conn.commit();
    conn.release();

    sendJson(res, 201, {
      id_pedido: idPedido,
      id_cliente: userId,
      total: computedTotal,
      estado,
    });
  } catch (err) {
    console.error('Error en handleCreateOrder:', err);
    try { await conn.rollback(); } catch {}
    conn.release();
    sendError(res, 500, 'Error creando el pedido');
  }
}

async function handleGetOrdersByUser(req, res, userId) {
  try {
    // ✅ Validar ID
    if (!userId || isNaN(userId)) {
      return sendError(res, 400, "ID de usuario inválido");
    }

    const [rows] = await pool.query(
      `SELECT
         p.id_pedido,
         p.fecha_pedido,
         p.estado,
         p.total,
         COUNT(d.id_detalle) AS itemsCount
       FROM pedido p
       LEFT JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
       WHERE p.id_cliente = ?
       GROUP BY p.id_pedido
       ORDER BY p.fecha_pedido DESC`,
      [userId]
    );

    sendJson(
      res,
      200,
      rows.map(r => ({
        id_pedido: r.id_pedido,
        fecha_pedido: r.fecha_pedido,
        estado: r.estado === 'pagado' ? 'completado' : r.estado,
        total: r.total,
        itemsCount: r.itemsCount,
      }))
    );
  } catch (err) {
    console.error('Error en handleGetOrdersByUser:', err);
    sendError(res, 500, 'Error obteniendo pedidos del usuario');
  }
}

async function handleGetOrderById(req, res, id) {
  try {
    // ✅ Validar ID
    if (!id || isNaN(id)) {
      return sendError(res, 400, "ID de pedido inválido");
    }

    const [pedidoRows] = await pool.query(
      `SELECT
         p.id_pedido,
         p.id_cliente,
         p.fecha_pedido,
         p.estado,
         p.total,
         c.nombre,
         c.correo,
         c.telefono
       FROM pedido p
       JOIN cliente c ON c.id_cliente = p.id_cliente
       WHERE p.id_pedido = ?`,
      [id]
    );

    if (pedidoRows.length === 0) {
      return sendError(res, 404, 'Pedido no encontrado');
    }

    const pedido = pedidoRows[0];

    const [detalleRows] = await pool.query(
      `SELECT
         d.id_detalle,
         d.id_producto,
         pr.nombre,
         d.cantidad,
         d.precio_unitario,
         d.subtotal
       FROM detalle_pedido d
       JOIN producto pr ON pr.id_producto = d.id_producto
       WHERE d.id_pedido = ?`,
      [id]
    );

    sendJson(res, 200, {
      ...pedido,
      estado: pedido.estado === 'pagado' ? 'completado' : pedido.estado,
      items: detalleRows,
    });
  } catch (err) {
    console.error('Error en handleGetOrderById:', err);
    sendError(res, 500, 'Error obteniendo detalle de pedido');
  }
}

// ===============================================
// SERVIDOR - ROUTING MEJORADO
// ===============================================
const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  try {
    if (segments[0] !== 'api') {
      return sendError(res, 404, 'Ruta no encontrada');
    }

    // ========================================
    // 🛍️ PRODUCTS
    // ========================================
    if (segments[1] === 'products') {
      // GET /api/products (con soporte para ?categoryId=X)
      if (req.method === 'GET' && segments.length === 2) {
        return handleGetProducts(req, res);
      }
      
      // GET /api/products/:id
      if (req.method === 'GET' && segments.length === 3) {
        const id = parseInt(segments[2], 10);
        if (isNaN(id)) {
          return sendError(res, 400, 'ID de producto inválido');
        }
        return handleGetProductById(req, res, id);
      }
    }

    // ========================================
    // 📂 CATEGORIES
    // ========================================
    if (segments[1] === 'categories') {
      // GET /api/categories
      if (req.method === 'GET' && segments.length === 2) {
        return handleGetCategories(req, res);
      }
      
      // GET /api/categories/:id
      if (req.method === 'GET' && segments.length === 3) {
        const id = parseInt(segments[2], 10);
        if (isNaN(id)) {
          return sendError(res, 400, 'ID de categoría inválido');
        }
        return handleGetCategoryById(req, res, id);
      }
    }

    // ========================================
    // 🔐 AUTH
    // ========================================
    if (segments[1] === 'auth') {
      if (segments[2] === 'login' && req.method === 'POST') {
        return handleLogin(req, res);
      }
      if (segments[2] === 'register' && req.method === 'POST') {
        return handleRegister(req, res);
      }
    }

    // ========================================
    // 📦 ORDERS
    // ========================================
    if (segments[1] === 'orders') {
      // POST /api/orders
      if (req.method === 'POST' && segments.length === 2) {
        return handleCreateOrder(req, res);
      }

      // GET /api/orders/user/:id
      if (req.method === 'GET' && segments[2] === 'user' && segments.length === 4) {
        const userId = parseInt(segments[3], 10);
        if (isNaN(userId)) {
          return sendError(res, 400, 'ID de usuario inválido');
        }
        return handleGetOrdersByUser(req, res, userId);
      }

      // GET /api/orders/:id
      if (req.method === 'GET' && segments.length === 3) {
        const id = parseInt(segments[2], 10);
        if (isNaN(id)) {
          return sendError(res, 400, 'ID de pedido inválido');
        }
        return handleGetOrderById(req, res, id);
      }
    }

    sendError(res, 404, 'Ruta no encontrada');

  } catch (err) {
    console.error('Error general en el servidor:', err);
    sendError(res, 500, 'Error interno del servidor');
  }
});

server.listen(PORT, () =>
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`)
);