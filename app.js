const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const port = process.env.PORT || 8080;
const cors = require("cors");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signIn = require('./routes/signIn');
const signUp = require('./routes/signUp');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const app = express();
// view engine setup

//   configuration
mongoose.connect("mongodb://localhost:27017/social", { useNewUrlParser: true });
mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
});



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    cors({
        origin: "http://localhost:3000",
        credential: true
    })
);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signIn', signIn);
app.use('/signUp', signUp);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(port);
module.exports = app;
