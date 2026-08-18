const { validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: secret123
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Invalid email or password
 */

const authController = {
    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterRequest'
     *     responses:
     *       201:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User registered successfully
     *                 user:
     *                   $ref: '#/components/schemas/UserResponse'
     *       400:
     *         description: Validation error or email already registered
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Internal server error
     */
    register: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const { name, email, password } = request.body;
            const user = await authService.register({ name, email, password });

            return response.status(201).json({
                message: 'User registered successfully',
                user,
            });
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login with email and password
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: User authenticated successfully. JWT set as httpOnly cookie.
     *         headers:
     *           Set-Cookie:
     *             schema:
     *               type: string
     *               example: jwtToken=eyJ...; Path=/; HttpOnly; Secure
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User authenticated
     *                 user:
     *                   $ref: '#/components/schemas/UserResponse'
     *       400:
     *         description: Invalid email or password
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       500:
     *         description: Internal server error
     */
    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }

            const { email, password } = request.body;
            const { token, user } = await authService.login({ email, password });

            const isProd = process.env.NODE_ENV === 'production';
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: isProd,                        // HTTPS only in production
                sameSite: isProd ? 'none' : 'lax',    // cross-site in prod, relaxed in dev
                path: '/',
                maxAge: 60 * 60 * 1000,               // 1 hour — matches JWT expiry
            });

            return response.status(200).json({
                message: 'User authenticated',
                user,
            });
        } catch (error) {
            const status = error.statusCode || 500;
            return response.status(status).json({ message: error.message });
        }
    },
};

module.exports = authController;
