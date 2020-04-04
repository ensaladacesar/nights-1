const jwt = require('jsonwebtoken');
const config = require('../config/config');

const checkAuth = (req, res, next) => {
    var token = req.headers['token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No existe el token.' });
    
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err)
            return res.status(500).send({ auth: false, message: 'Falló el token. ' });
            req.user = {
                login: decoded.login,
                id: decoded.id
           };
           next();
    });
}

module.exports = {
    checkAuth
}