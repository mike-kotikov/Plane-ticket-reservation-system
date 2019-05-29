const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
require('./passportSetup')(passport);
const cors = require('cors');

const authRouter = require('./routes/auth');
const getRouter = require('./routes/get');
const postRouter = require('./routes/post');

const app = express();

app.use(logger(process.env.LOGGER_CONFIG));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('../public/index.html'));

app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.ORIGIN_URL
  })
);

app.use('/auth', authRouter);
app.use('/get', getRouter);
app.use('/post', passport.authenticate('jwt', { session: false }), postRouter);

app.use(function(req, res, next) {
  next(createError(404, 'The page you are looking for does not exist.'));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

const port = process.env.SERVER_PORT || '3000';

app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;