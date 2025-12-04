// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/categoria/:categoriaId", productController.getProductsByCategory);

module.exports = router;
