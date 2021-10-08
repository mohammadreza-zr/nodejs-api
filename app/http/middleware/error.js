const winston = require('winston');

module.exports = (error, req, res, next) => {
  winston.error(error.message);
  res.status(500).send('Error from server...');
};
