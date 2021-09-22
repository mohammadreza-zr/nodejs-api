const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('welcome', {
    title: 'welcome',
    name: 'nodejs curse',
    message: 'welcome to...',
  });
});

module.exports = router;
