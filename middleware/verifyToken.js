const jwt = require('jsonwebtoken');

function authVerify(req, res, next ) {
  const token = req.header('auth-token');
  if(!token) {
    return res.status(401).json({message: 'Access denied'});
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
  } catch(err) {
    return res.status(401).json({message: 'Invalid token'});
  }
  next();
}

module.exports = authVerify;