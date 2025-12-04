import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    // Solo insertamos en la tabla cliente
    const [result] = await pool.query(
      "INSERT INTO cliente (nombre, correo, contrasena) VALUES (?, ?, ?)",
      [nombre, email, hashed]
    );

    res.json({ 
      message: "Usuario registrado correctamente",
      user: {
        id: result.insertId,
        nombre,
        email
      }
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error registrando usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM cliente WHERE correo = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "Usuario no encontrado" });

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.contrasena);
    if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id_cliente }, "clave123");

    res.json({
      token,
      user: {
        id: user.id_cliente,
        nombre: user.nombre,
        email: user.correo
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error en login" });
  }
};