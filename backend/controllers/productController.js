const pool = require('../db');

// Obtener productos por ID de categoría
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoriaId = req.params.categoriaId;

    // Validar existencia de la categoría
    const [catRows] = await pool.query(
      "SELECT * FROM categoria WHERE id_categoria = ?",
      [categoriaId]
    );

    if (catRows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Obtener productos
    const [productos] = await pool.query(
      "SELECT * FROM producto WHERE id_categoria = ?",
      [categoriaId]
    );

    res.json({
      categoria: catRows[0],
      productos
    });

  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
