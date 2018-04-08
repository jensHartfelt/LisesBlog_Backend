var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var db = require('../db')
var helpers = require('../helpers')

// Get all posts
router.get('/', (req, res) => {
	/**
	 * Query params:
	 * 
	 * offset <int> example: 11
	 * amount <int> example: 10
	 * overview <int/bool> example: 1, 0
	 */

	var offset = req.query.offset ? req.query.offset : 0;
	var amount = req.query.amount ? req.query.amount : 10;
	var overview = req.query.overview ? req.query.overview : 0;

	// Dynamically switch between what columns to return. Overview only returns a subset of the post
	var columns;
	if (overview == 1) {
		columns = `t5.post_id, title, lead, tags`;
	} else {
		columns = `t5.post_id, title, lead, content, tags, created_at, u.username`;
	}

	var query = `
	SELECT ${columns} FROM (
		SELECT t4.post_id, json_agg(t4.tag_name) AS tags FROM (
			SELECT post_id, t2.tag_id, t3.name as tag_name FROM (
				SELECT t1.post_id, unnest(t1.tag_ids) as tag_id
				FROM posts AS t1
			) AS t2
			JOIN tags as t3 ON t2.tag_id=t3.tag_id
		) AS t4
		GROUP BY t4.post_id
		ORDER BY t4.post_id
	) AS t5
	JOIN posts as p ON t5.post_id = p.post_id
	JOIN users as u ON p.owner_id = u.user_id
	WHERE public = true
	LIMIT $1 OFFSET $2`;

	var values = [amount, offset]

	db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				posts: dbOutput.rows
			})
			// res.send({status: "OK", users: users.rows})
		})
		.catch(msg => {
			console.log(msg)
			res.send({
				status: "ERROR",
				message: "Could not get posts"
			})
		})
})

router.get('/:postId', (req, res) => {
	/**
	 * Query params:
	 * 
	 * offset <int> example: 11
	 * amount <int> example: 10
	 * overview <int/bool> example: 1, 0
	 */
	var postId = req.params.postId;

	var query = `
	SELECT t5.post_id, title, lead, content, tags, created_at, u.username FROM (
		SELECT t4.post_id, json_agg(t4.tag_name) AS tags FROM (
			SELECT post_id, t2.tag_id, t3.name as tag_name FROM (
				SELECT t1.post_id, unnest(t1.tag_ids) as tag_id
				FROM posts AS t1
			) AS t2
			JOIN tags as t3 ON t2.tag_id=t3.tag_id
		) AS t4
		GROUP BY t4.post_id
		ORDER BY t4.post_id
	) AS t5
	JOIN posts as p ON t5.post_id = p.post_id
	JOIN users as u ON p.owner_id = u.user_id
	WHERE public = true AND t5.post_id = $1`;

	var values = [postId]

	db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				post: dbOutput.rows[0]
			})
		})
		.catch(msg => {
			console.log(msg)
			res.send({
				status: "ERROR",
				message: "Could not get posts"
			})
		})
})

// Adds a new spost
router.post('/', helpers.verifyToken, (req, res) => {
	var query = 'INSERT INTO posts (title, lead, content, tag_ids, owner_id, public) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
	var values = [
		req.fields.title,
		req.fields.lead,
		req.fields.content,
		req.fields.tag_ids,
		req.fields.owner_id,
		req.fields.public
	]

	db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				post: dbOutput.rows[0],
				authData: res.locals.authData
			})
			// res.send({status: "OK", users: users.rows})
		})
		.catch(msg => {
			res.send({
				status: "ERROR",
				message: "Could not add post"
			})
		})
})

// Adds a new spost
router.put('/:postId', helpers.verifyToken, (req, res) => {
	var query = 'UPDATE posts SET title = $1, lead = $2, content = $3, tag_ids = $4, public = $5 WHERE post_id = $6 RETURNING *'
	var values = [
		req.fields.title,
		req.fields.lead,
		req.fields.content,
		req.fields.tag_ids,
		req.fields.public,
		req.params.postId
	]

	db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				post: dbOutput.rows[0],
			})
		})
		.catch(msg => {
			console.log(msg)
			res.send({
				status: "ERROR",
				message: "Could not edit post"
			})
		})
})

// Adds a new spost
router.delete('/:postId', helpers.verifyToken, (req, res) => {
	var query = 'DELETE FROM posts WHERE post_id = $1 RETURNING *'
	var values = [req.params.postId]

	db.query(query, values)
		.then(dbOutput => {
			res.json({
				status: "OK",
				post: dbOutput.rows[0],
			})
		})
		.catch(msg => {
			console.log(msg)
			res.send({
				status: "ERROR",
				message: "Could not edit post"
			})
		})
})

module.exports = router;