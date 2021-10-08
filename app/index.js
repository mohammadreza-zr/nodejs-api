const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const customRoutes = require('./routes/customerRoute');
const homeRoutes = require('./routes/HomeRoute');
const userRoutes = require('./routes/userRoute');
const mongoose = require('mongoose');
const error = require('./http/middleware/error');
const app = express();

class Application {
  constructor() {
    this.setupExpressSever();
    this.setupMongoose();
    this.setupRoutesAndMiddleware();
    this.setupConfig();
  }

  setupRoutesAndMiddleware() {
    // built-in middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    if (app.get('env') === 'development') {
      app.use(morgan('tiny'));
    }
    // third-party middleware
    app.use(cors());
    //routes
    app.use(homeRoutes);
    app.use(customRoutes);
    app.use(userRoutes);
    app.use(error);
  }

  setupConfig() {
    winston.add(new winston.transports.File({ filename: 'error-log.log' }));
    winston.add(
      new winston.transports.MongoDB({
        db: 'mongodb://localhost:27017/CustomerDb',
        level: 'error',
      }),
    );
    process.on('uncaughtException', (err) => {
      winston.error(err);
    });
    process.on('unhandledRejection', (err) => {
      winston.error(err);
    });
    //view engin
    app.set('view engine', 'pug');
    app.set('views', './views');
  }

  setupMongoose() {
    mongoose
      .connect('mongodb://localhost:27017/CustomerDb')
      .then(() => {
        console.log('db connected');
      })
      .catch((err) => {
        console.log('db not connected', err);
      });
  }

  setupExpressSever() {
    const port = process.argv.slice(2).toString() || 3000;
    app.listen(port, (err) => {
      if (err) console.log(err);
      else console.log(`app listen to port ${port}`);
    });
  }
}

module.exports = Application;
