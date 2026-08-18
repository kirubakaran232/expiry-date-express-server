const productDao = require('../dao/productDao');

const PAGE_LIMIT = 20;

/**
 * Resolves a named expiry filter preset into a { from, to } date range.
 * Presets: 'today' | '7d' | '1m' | '3m' | '6m'
 */
const resolveExpiryFilter = (filter) => {
    if (!filter || filter === 'all') return {};

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const presets = {
        today: { expiryFrom: startOfToday, expiryTo: new Date(startOfToday.getTime() + 86400000 - 1) },
        '7d':  { expiryFrom: startOfToday, expiryTo: new Date(startOfToday.getTime() + 7 * 86400000) },
        '1m':  { expiryFrom: startOfToday, expiryTo: new Date(startOfToday.getTime() + 30 * 86400000) },
        '3m':  { expiryFrom: startOfToday, expiryTo: new Date(startOfToday.getTime() + 90 * 86400000) },
        '6m':  { expiryFrom: startOfToday, expiryTo: new Date(startOfToday.getTime() + 180 * 86400000) },
    };

    return presets[filter] || {};
};

const productService = {
    getProductById: async ({ id, userId }) => {
        const product = await productDao.findById(id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        if (product.userId.toString() !== userId.toString()) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }
        return product;
    },

    getProducts: async ({ userId, search, expiryFilter, page = 1 }) => {
        const limit = PAGE_LIMIT;
        const { expiryFrom, expiryTo } = resolveExpiryFilter(expiryFilter);

        const { products, totalCount } = await productDao.findAllByUser({
            userId,
            search: search?.trim() || null,
            expiryFrom,
            expiryTo,
            page: Math.max(1, parseInt(page, 10)),
            limit,
        });

        const totalPages = Math.ceil(totalCount / limit);

        return {
            products,
            pagination: {
                totalCount,
                totalPages,
                currentPage: parseInt(page, 10),
                limit,
            },
        };
    },

    createProduct: async ({ userId, title, upc, amount, expiryDate }) => {
        return productDao.createProduct({ userId, title, upc, amount, expiryDate });
    },

    updateProduct: async ({ id, userId, title, upc, amount, expiryDate }) => {
        const product = await productDao.findById(id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        if (product.userId.toString() !== userId.toString()) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }
        return productDao.updateProduct(id, { title, upc, amount, expiryDate });
    },

    deleteProduct: async ({ id, userId }) => {
        const product = await productDao.findById(id);
        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        if (product.userId.toString() !== userId.toString()) {
            const error = new Error('Forbidden');
            error.statusCode = 403;
            throw error;
        }
        return productDao.deleteProduct(id);
    },
};

module.exports = productService;
