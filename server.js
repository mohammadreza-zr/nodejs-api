const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('config');
const debugConfiguration = require('debug')('app:configuration');
const debugDB = require('debug')('app:Db');
const customRoutes = require('./routes/customRoute');
const homeRoutes = require('./routes/HomeRoute');
const userRoutes = require('./routes/userRoute');
const logger = require('./middleware/logger');
// const front = require('./middleware/fontAuth');
const saeedForbiddenAuth = require('./middleware/saeedForbiddenAuth');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const app = express();

// built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// third-party middleware
app.use(cors());

//my middleware
app.use(logger);
app.use(saeedForbiddenAuth);

//routes
app.use(homeRoutes);
app.use(customRoutes);
app.use(userRoutes);
app.use(auth);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

debugConfiguration('some configuration');

// db ...
debugDB('db initialized');

//configuration
// console.log(config.get('databaseAddress'));

//view engin
app.set('view engine', 'pug');
app.set('views', './views');

//database connect
mongoose
  .connect('mongodb://localhost:27017/CustomerDb')
  .then(() => {
    console.log('db connected');
  })
  .catch((err) => {
    console.log('db not connected', err);
  });

const port = process.argv.slice(2).toString() || 3000;
app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`app listen to port ${port}`);
});
