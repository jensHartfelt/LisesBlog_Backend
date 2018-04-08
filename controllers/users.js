var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../db')
var helpers = require('../helpers')
var saltRounds = 10; // Sets cryptography depth i think
// require('dotenv').load(); // Configuration stuff

// Get all users
router.get('/', helpers.verifyToken, (req, res) => {
    db.query('SELECT first_name, last_name, email FROM users')
    .then(users => {
        res.json({
            status: "OK",
            users: users.rows,
            authData: res.locals.authData
        })
        // res.send({status: "OK", users: users.rows})
    })
    .catch(msg => {
        res.send({status: "ERROR", message: "Could not get users"})
    })
})

// Get specific user
router.get('/:id', helpers.verifyToken, (req, res) => {
    db.query('SELECT first_name, last_name, email FROM users WHERE user_id = $1', [req.params.id])
    .then(result => {
        res.send({status: "OK", user: result.rows[0]})
    })
    .catch(msg => {
        res.send({status: "ERROR", message: "Could not get user with user_id: "+req.params.id})
    })
})

// Add user
router.post('/', (req, res) => {
    var query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';

    bcrypt.hash(req.fields.password, saltRounds, (err, hashedPassword) => {
        if (err) {
            res.status(500)
            res.send({status: "ERROR", message: "Couldn't add user."})
        }
        var values = [
            req.fields.username, 
            req.fields.email, 
            hashedPassword // hashed password
        ];
    
        db.query(query, values)
        .then(msg => {
            res.send({status: "OK", message: "added user. "+req.fields.username+" "+req.fields.email})
        })
        .catch(msg => {
            res.send({status: "ERROR", message: "Couldn't add user."})
        })
    })
})

// Edit user
router.put('/:id', helpers.verifyToken, (req, res) => {
    // If authenticated user is not the same as the one requested to be edited, the action will
    // be denied
    if (res.locals.authData.user.user_id != req.params.id) {
        res.sendStatus(403)
        return
    }


    var query = 'UPDATE users SET ';
    var values = [];
    
    function checkForComma(values) {
        // If more than one value have been added to the array the new statement
        // should start with a comma.
        return values.length > 1 ? ',' : '';
    }

    if (req.fields.first_name) {
        values.push(req.fields.first_name);
        query += checkForComma(values)+'first_name = $'+values.length;
    }
    if (req.fields.last_name) {
        values.push(req.fields.last_name)     
        query += checkForComma(values)+'last_name = $'+values.length;
    }
    if (req.fields.email) {
        values.push(req.fields.email)
        query += checkForComma(values)+'email = $'+values.length;
    }

    checkForPassword()

    function checkForPassword() {
        if (req.fields.password) {
            bcrypt.hash(req.fields.password, saltRounds)
            .then(hash => {
                values.push(hash)
                query += checkForComma(values)+'password = $'+values.length;
                finishAndRunQuery()
            })
            .catch(sendError) // Unable to hash password
        } else {
            finishAndRunQuery()
        }
    }
    
    function finishAndRunQuery() {
        values.push(req.params.id)
        query += ' WHERE user_id = $'+values.length;
        db.query(query, values)
        .then(msg => {
            res.status(200)
            res.send({status: "OK", message: "Edited user width user_id: "+req.params.id})
        })
        .catch(sendError)
    }
    
    function sendError() {
        res.status(500)
        res.send({status: "ERROR", message: "Couldn't edit user."})
    }a
})

// Delete user
router.delete('/:id', helpers.verifyToken, (req, res) => {
    if (res.locals.authData.user.user_id != req.params.id) {
        res.sendStatus(403)
        return
    }

    if (!req.params.id) {
        res.send({status: "ERROR", message: "No user_id where passed"})
    }

    var query = 'DELETE FROM users WHERE user_id = $1';
    var values = [req.params.id]; 

    db.query(query, values)
    .then(msg => {
        res.send({status: "OK", message: "Deleted user with user_id: "+req.params.id})
    })
    .catch(err => {
        res.send({status: "ERROR", message: "Couldn't delete user."})
    })
})

module.exports = router;