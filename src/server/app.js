const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const validator = require('express-validator');
const errorHandler = require('errorhandler');
const api = require('./api/index');
const app = express();

const PORT = process.env.NODE_ENV !== 'development' ? 3000 : 8080;
const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}!`));

// [START] for bottender message
app.use(
    bodyParser.json({
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    })
);
// [END] for bottender message
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

app.use(express.static('dist'));
app.use(logger('dev'));
app.use(validator()); // this line must be immediately after express.bodyParser()!

app.use(cookieParser());
app.use((req, res, next) => {
    // req.user = {_id: '5840e3481ee48c1a3d68aaaa'}; //temp: set dev admin user._id
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

app.use('/api', api);

if (process.env.NODE_ENV !== 'development') {
    app.get('*', (req, res) => {
        let filePath = './dist/index.html'
        let index = path.resolve(filePath);
        console.log(index);
        res.sendFile(index)
    });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found!');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(errorHandler());
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    //res.redirect('/');
    res.render('errhandle/error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
