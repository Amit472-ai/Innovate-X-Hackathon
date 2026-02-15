const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    // Format: "Bearer <token>"
    const tokenHeader = req.header('Authorization');

    // Check if not token
    if (!tokenHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const token = tokenHeader.split(' ')[1]; // Remove "Bearer "
        if (!token) throw new Error("Token missing");

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret'); // Fallback secret for dev
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
