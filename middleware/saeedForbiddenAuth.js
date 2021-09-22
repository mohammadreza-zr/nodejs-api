module.exports = (req, res, next) => {
  if (req.query.name === 'saeed') {
    return res.send('ما به سعید ها جواب نمیدیم');
  }
  next();
};
