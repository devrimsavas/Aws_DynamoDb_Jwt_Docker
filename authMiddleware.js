// it is JWT middleware 

// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];  // Extract token

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Access denied. No token provided."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;  // Store the decoded user in the request
    next();
  } catch (err) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid token."
    });
  }
};

module.exports = verifyToken;
