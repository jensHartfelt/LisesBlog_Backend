var express = require('express');
var app = express();
var formidable = require('express-formidable');

db = require('./db')

app.use(formidable())

// Users
usersController = require(__dirname+'/controllers/users');
app.use('/api/users', usersController);

// Posts
postsController = require(__dirname+'/controllers/posts');
app.use('/api/posts', postsController);

// Posts
tagsController = require(__dirname+'/controllers/tags');
app.use('/api/tags', tagsController);

// Auth  
AuthController = require(__dirname+'/controllers/auth');
app.use('/api/auth', AuthController);

app.get('/', (req, res) => {
    res.json({
        status: "OK",
        message: "Hey"
    })
})

module.exports = app;