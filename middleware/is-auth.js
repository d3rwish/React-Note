const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authDataHeader = req.get('Authorization');
    if (!authDataHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authDataHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretKey');
    }
    catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}