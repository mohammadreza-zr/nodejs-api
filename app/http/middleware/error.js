const winston = require('winston');

module.exports = (error, req, res, next) => {
  if (error.type === 'entity.parse.failed') return res.status(400).send('syntax error');
  winston.error(error);
  res.status(500).send('Error from server...');
};
