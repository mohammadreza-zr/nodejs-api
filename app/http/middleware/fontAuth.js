const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = (req, res, next) => {
  const token = req.header('front-auth-token');
  if (!token) return res.status(401).send("you don't have access from other where!");
  try {
    const front = jwt.verify(token, config.get('jwtPrivetKey'));
    req.front = front;
    next();
  } catch (ex) {
    return res.status(401).send("you don't have access!");
  }
};
