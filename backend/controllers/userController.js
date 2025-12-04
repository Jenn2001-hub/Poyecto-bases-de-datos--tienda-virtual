import { pool } from "../db.js";

export const getUsers = async (_, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_usuario AS id, nombre, correo, rol, estado_cuenta FROM usuario"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol, estadoCuenta } = req.body;

    await pool.query(
      "UPDATE usuario SET nombre=?, correo=?, rol=?, estado_cuenta=? WHERE id_usuario=?",
      [nombre, correo, rol, estadoCuenta, id]
    );

    res.json({ message: "Usuario actualizado" });
  } catch {
    res.status(500).json({ error: "Error actualizando usuario" });
  }
};
