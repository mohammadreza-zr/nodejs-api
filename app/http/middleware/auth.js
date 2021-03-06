const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .send({ message: "you don't have access! please login again." });
  try {
    const user = jwt.verify(token, config.get('jwtPrivetKey'));
    req.user = user;
    next();
  } catch (ex) {
    return res.status(401).send({ message: "you don't have access!" });
  }
};
