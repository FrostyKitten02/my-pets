const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/');
const petsRouter = require('./routes/pets');
const usersRouter = require('./routes/users');
const foodRouter = require('./routes/food');
const treatsRouter = require('./routes/treats');
const feedingRouter = require('./routes/feeding');
const petTreatsRouter = require('./routes/pet_treats');
const visitsRouter = require('./routes/veterinary_visits');
const recordsRouter = require('./routes/medical_records');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//removed cors
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remove this or restrict it
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


//ROUTERS
app.use('/', indexRouter);
app.use('/pets', petsRouter);
app.use('/users', usersRouter);
app.use('/food', foodRouter);
app.use('/treats', treatsRouter);
app.use('/feeding', feedingRouter);
app.use('/pettreats', petTreatsRouter);
app.use('/veterinary-visits', visitsRouter);
app.use('/medical-records', recordsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
