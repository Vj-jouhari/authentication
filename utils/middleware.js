const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const logger = require('../utils/log');

exports.isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        logger.info('Unauthorise User');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = (req.headers['authorization']).split(" ")[1];
    if (!token) {
        logger.info('Blank token Passed');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
        logger.info( err);
        return res.status(401).json({ message: 'Token is not valid' });
    }
    req.user = decoded;
    next();
    });
}