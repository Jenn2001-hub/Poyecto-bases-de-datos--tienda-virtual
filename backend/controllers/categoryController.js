const pool = require('../db');

// Obtener categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await pool.query(
      "SELECT * FROM categoria WHERE id_categoria = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
