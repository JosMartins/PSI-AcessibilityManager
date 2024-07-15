//const mongoose = require("mongodb");
const mongoose = require("mongoose");
const express = require("express");
const createError = require('http-errors');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const initRouter = require('./routes/init');
const websitesRouter = require('./routes/websites');
const websiteRouter = require('./routes/website');
const pagesRouter = require('./routes/pages');


const exp = require("constants");
const app = express();

// Set up mongoose connection
//mongoose.set("strictQuery", false);
const mongoDB = "mongodb://psi017:psi017@appserver.alunos.di.fc.ul.pt:27017/psi017?retryWrites=true&authSource=psi017";
//const mongoDB = "mongodb+srv://mariaagds:1234@cluster0.awzqt3p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to DB!");
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', initRouter);
app.use('/websites', websitesRouter);
app.use('/website', websiteRouter);
app.use('/pages', pagesRouter);



// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack); // Log the error stack trace for debugging

  // Customize the error message based on the error type
  let errorMessage = 'An unexpected error occurred';
  if (err.message) {
    errorMessage = err.message;
  }

  res.status(err.status || 500);
  res.json({ error: errorMessage });
});

module.exports = app;
