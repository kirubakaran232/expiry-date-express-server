const { validationResult } = require('express-validator');
const productService = require('../services/productService');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product expiry management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d2
 *         userId:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: Whole Milk
 *         upc:
 *           type: string
 *           example: "012345678901"
 *         amount:
 *           type: number
 *           example: 2
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductRequest:
 *       type: object
 *       required:
 *         - title
 *         - expiryDate
 *       properties:
 *         title:
 *           type: string
 *           example: Whole Milk
 *         upc:
 *           type: string
 *           example: "012345678901"
 *         amount:
 *           type: number
 *           example: 2
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: "2025-01-31"
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         totalCount:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         limit:
 *           type: integer
 */

const productController = {
    /**
     * @swagger
     * /products:
     *   get:
     *     summary: Get paginated list of products for the authenticated user
     *     tags: [Products]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search by title or UPC
     *       - in: query
     *         name: expiryFilter
     *         schema:
     *           type: string
     *           enum: [all, today, 7d, 1m, 3m, 6m]
     *         description: Preset expiry date filter
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number (20 per page)
     *     responses:
     *       200:
     *         description: Paginated product list
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 products:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Product'
     *                 pagination:
     *                   $ref: '#/components/schemas/PaginationMeta'
     *       401:
     *         description: Unauthorized
     */
    getProducts: async (request, response) => {
        try {
            const { search, expiryFilter, page } = request.query;
            const result = await productService.getProducts({
                userId: request.user._id,
                search,
                expiryFilter,
                page,
            });
            return response.status(200).json(result);
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },

    /**
     * @swagger
     * /products/{id}:
     *   get:
     *     summary: Get a single product by ID
     *     tags: [Products]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 product:
     *                   $ref: '#/components/schemas/Product'
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Product not found
     */
    getProductById: async (request, response) => {
        try {
            const product = await productService.getProductById({
                id: request.params.id,
                userId: request.user._id,
            });
            return response.status(200).json({ product });
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },

    /**
     * @swagger
     * /products:
     *   post:
     *     summary: Create a new product
     *     tags: [Products]
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ProductRequest'
     *     responses:
     *       201:
     *         description: Product created
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Product created successfully
     *                 product:
     *                   $ref: '#/components/schemas/Product'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     */
    createProduct: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const { title, upc, amount, expiryDate } = request.body;
            const product = await productService.createProduct({
                userId: request.user._id,
                title,
                upc,
                amount,
                expiryDate,
            });

            return response.status(201).json({ message: 'Product created successfully', product });
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },

    /**
     * @swagger
     * /products/{id}:
     *   put:
     *     summary: Update a product
     *     tags: [Products]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/ProductRequest'
     *     responses:
     *       200:
     *         description: Product updated
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 product:
     *                   $ref: '#/components/schemas/Product'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Product not found
     */
    updateProduct: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const { title, upc, amount, expiryDate } = request.body;
            const product = await productService.updateProduct({
                id: request.params.id,
                userId: request.user._id,
                title,
                upc,
                amount,
                expiryDate,
            });

            return response.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },

    /**
     * @swagger
     * /products/{id}:
     *   delete:
     *     summary: Delete a product
     *     tags: [Products]
     *     security:
     *       - cookieAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID
     *     responses:
     *       200:
     *         description: Product deleted
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Product not found
     */
    deleteProduct: async (request, response) => {
        try {
            await productService.deleteProduct({
                id: request.params.id,
                userId: request.user._id,
            });
            return response.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },
};

module.exports = productController;
