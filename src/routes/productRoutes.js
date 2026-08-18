const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ── Validators ────────────────────────────────────────────────────────────────
const productValidators = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('expiryDate').notEmpty().withMessage('Expiry date is required').isISO8601().withMessage('Expiry date must be a valid date'),
    body('amount').optional({ nullable: true }).isNumeric().withMessage('Amount must be a number'),
    body('upc').optional({ nullable: true }).trim(),
];

// ── All product routes require authentication ─────────────────────────────────
router.use(authMiddleware.protect);

// ── Routes ────────────────────────────────────────────────────────────────────
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productValidators, productController.createProduct);
router.put('/:id', productValidators, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
