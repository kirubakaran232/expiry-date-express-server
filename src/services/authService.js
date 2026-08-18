const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/userDao');

const SALT_ROUNDS = 10;

const authService = {
    register: async ({ name, email, password }) => {
        const existingUser = await userDao.findByEmail(email);
        if (existingUser) {
            const error = new Error('Email is already registered');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await userDao.createUser({ name, email, password: hashedPassword });

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    },

    login: async ({ email, password }) => {
        const user = await userDao.findByEmail(email);
        const isPasswordMatched = user && (await bcrypt.compare(password, user.password));

        if (!isPasswordMatched) {
            const error = new Error('Invalid email or password');
            error.statusCode = 400;
            throw error;
        }

        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        };
    },
};

module.exports = authService;
