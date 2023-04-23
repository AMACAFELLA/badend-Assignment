const express = require('express');
const router = express.Router();
const productController = require('../ controllers/products');
const auth = require('../middlewares/auth');

// GET /products
router.get('/', productController.getAllProducts);

// GET /products/:id
router.get('/:id', productController.getProductById);

// POST /products
router.post('/', auth, productController.createProduct);

// PUT /products/:id
router.put('/:id', auth, productController.updateProduct);

// DELETE /products/:id
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
