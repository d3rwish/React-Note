const authResolver = require('./auth');
const notesResolver = require('./notes');
const usersResolver = require('./users');

const rootResolver = {
    ...authResolver,
    ...notesResolver,
    ...usersResolver,
};

module.exports = rootResolver;