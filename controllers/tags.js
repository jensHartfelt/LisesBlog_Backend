var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../db')
var helpers = require('../helpers')

// Get all posts
router.get('/', (req, res) => {
	db.query('SELECT tag_id, name FROM tags')
		.then(dbOutput => {
			res.json({
				status: "OK",
				tags: dbOutput.rows
			})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not get posts"
			})
		})
})

// Get post by id
router.get('/:tag_id', (req, res) => {
  var query = 'SELECT tag_id, name FROM tags WHERE tag_id = $1';
  var values = [req.params.tag_id];

  db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				tags: dbOutput.rows
			})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not get post"
			})
		})
})

// Get post by id
router.put('/:tag_id', (req, res) => {
  var query = 'UPDATE tags SET name = $1 WHERE tag_id = $2 RETURNING *';
  var values = [req.fields.name, req.params.tag_id];

  db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				tags: dbOutput.rows
			})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not edit posts"
			})
		})
})

// Get post by id
router.delete('/:tag_id', (req, res) => {
  var query = 'DELETE FROM tags WHERE tag_id = $1 RETURNING *';
  var values = [req.params.tag_id];

  db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				tags: dbOutput.rows
			})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not edit posts"
			})
		})
})
// Get post by id
router.put('/:tag_id', (req, res) => {
  var query = 'UPDATE tags SET name = $1 WHERE tag_id = $2 RETURNING *';
  var values = [req.fields.name, req.params.tag_id];

  db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				tags: dbOutput.rows
			})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not edit posts"
			})
		})
})

// Adds a new spost
router.post('/', helpers.verifyToken, (req, res) => {
	var query = 'INSERT INTO tags (name) VALUES ($1) RETURNING *';
	var values = [req.fields.name]

	db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				tag: dbOutput.rows[0]
			})
			// res.send({status: "OK", users: users.rows})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not add tag"
			})
		})
})

module.exports = router;