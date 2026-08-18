const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const connectDB = require('./src/config/db');
const swaggerSpec = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// ── Startup env check ─────────────────────────────────────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}
console.log(`[env] NODE_ENV      = ${process.env.NODE_ENV}`);
console.log(`[env] CLIENT_ORIGIN = ${process.env.CLIENT_ORIGIN}`);
console.log(`[env] SERVER_URL    = ${process.env.SERVER_URL}`);
console.log(`[env] MONGO_URI     = ${process.env.MONGO_URI?.replace(/:([^@]+)@/, ':***@')}`);
console.log(`[env] JWT_SECRET    = ${process.env.JWT_SECRET ? '(set)' : '(NOT SET)'}`);

// ── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
        credentials: true,
    })
);

// ── Swagger UI ────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (request, response) => {
    response.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
