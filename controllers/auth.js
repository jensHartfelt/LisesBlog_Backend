var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../db');
var jwt = require('jsonwebtoken');
var saltRounds = 10; // Sets cryptography depth i think
var helpers = require("../helpers");
// require('dotenv').load(); // Configuration stuff

// Login user
router.post('/login', (req, res) => {
    var query = "SELECT 'userId', username, email, password FROM users WHERE username = $1 OR email = $1";
    var user;
    var values = [];
    if (req.fields.email) {
        values.push(req.fields.email)
    } else if (req.fields.username) {
        values.push(req.fields.username)
    } else {
        return sendError();
    }
    
    db.query(query, values)
    .then(dbRes => {
        user = {
            userId: dbRes.rows[0].user_id,
            username: dbRes.rows[0].username,
            email: dbRes.rows[0].email
        }
        var password = req.fields.password;
        bcrypt.compare(password, dbRes.rows[0].password)
        .then(res => {
            if (res) {
                loginUser()
            } else {
                sendError()
            }
        })
        .catch(sendError)
    })
    .catch(sendError)
    
    function loginUser() { 
        jwt.sign({user: user}, process.env.JWT_SECRET, (err, token) => {
            res.json({
                status: "OK",
                message: "Logged in",
                token: token,
                user: user
            })
        })
    }

    function sendError(err) {
        console.log("err", err)
        res.status(200)
        res.send({status: "ERROR", message: "Could not login"})
    }
})

router.get('/check-token', helpers.verifyToken, (req, res) => {
    if (res.locals.authData) {
        return res.json({
            status: "OK",
            message: "User is logged in",
            user: res.locals.authData
        })
    }
})

module.exports = router;