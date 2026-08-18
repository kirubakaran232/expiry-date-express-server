const Product = require('../models/productModel');

const productDao = {
    /**
     * Find paginated products for a user with optional search and expiry filter.
     * @param {object} opts
     * @param {string} opts.userId
     * @param {string} [opts.search]        - title or UPC regex search
     * @param {Date}   [opts.expiryFrom]    - start of expiry range
     * @param {Date}   [opts.expiryTo]      - end of expiry range
     * @param {number} opts.page
     * @param {number} opts.limit
     */
    findAllByUser: async ({ userId, search, expiryFrom, expiryTo, page, limit }) => {
        const query = { userId };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { upc: { $regex: search, $options: 'i' } },
            ];
        }

        if (expiryFrom || expiryTo) {
            query.expiryDate = {};
            if (expiryFrom) query.expiryDate.$gte = expiryFrom;
            if (expiryTo) query.expiryDate.$lte = expiryTo;
        }

        const skip = (page - 1) * limit;
        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .sort({ expiryDate: 1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query),
        ]);

        return { products, totalCount };
    },

    findById: async (id) => {
        return Product.findById(id).lean();
    },

    createProduct: async (data) => {
        const product = new Product(data);
        return product.save();
    },

    updateProduct: async (id, data) => {
        return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    },

    deleteProduct: async (id) => {
        return Product.findByIdAndDelete(id).lean();
    },
};

module.exports = productDao;
