const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        upc: {
            type: String,
            trim: true,
            default: null,
        },
        amount: {
            type: Number,
            default: null,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// Compound index for efficient user+expiry queries
productSchema.index({ userId: 1, expiryDate: 1 });

module.exports = mongoose.model('Product', productSchema);
