const Note = require('../../models/note');
const User = require('../../models/user');

const transformNote = note => {
    return {
        ...note._doc,
        _id: note.id,
        creator: user.bind(this, note.creator),
    };
};

const transformUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        password: null
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return transformUser(user);
    }
    catch (err) {
        throw err;
    }
};

exports.transformNote = transformNote;
exports.transformUser = transformUser;