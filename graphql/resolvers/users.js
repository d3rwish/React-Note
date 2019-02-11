const User = require('../../models/user');
const { transformUser } = require('./merge');

module.exports = {
    singleUser: async args => {
        try {
            const user = await User.findById(args.userId);
            return transformUser(user);
        }
        catch (err) {
            throw err;
        }
    }
};