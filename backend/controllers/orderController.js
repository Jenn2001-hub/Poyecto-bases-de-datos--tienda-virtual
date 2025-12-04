import { pool } from "../db.js";

export const createOrder = async (req, res) => {
  try {
    const { idUsuario, total } = req.body;

    const [result] = await pool.query(
      "INSERT INTO pedido (id_usuario, total) VALUES (?, ?)",
      [idUsuario, total]
    );

    res.json({ id: result.insertId });
  } catch {
    res.status(500).json({ error: "Error creando pedido" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM pedido WHERE id_usuario = ?",
      [id]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM pedido WHERE id_pedido = ?",
      [id]
    );

    res.json(rows[0] ?? {});
  } catch {
    res.status(500).json({ error: "Error obteniendo pedido" });
  }
};
