const User = require('../models/userModel');

const userDao = {
    findByEmail: async (email) => {
        const user = await User.findOne({ email });
        return user;
    },

    createUser: async ({ name, email, password }) => {
        const user = new User({ name, email, password });
        return await user.save();
    },
};

module.exports = userDao;
