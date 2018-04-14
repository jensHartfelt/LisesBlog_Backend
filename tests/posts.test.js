require('dotenv').config();
var chai = require('chai');
var chaiHttp = require('chai-http')
var should = chai.should();
var request = require('request')

chai.use(chaiHttp)

describe("Posts", () => {
  // Dummy post
  var postToAdd = {
    "title": "test-title",
    "lead": "test-lead",
    "content": "test-content",
    "tag_ids": [1],
    "owner_id": 2,
    "public": true
  }
  var updatedPostContent = {
    "title": "updated-test-title",
    "lead": "updated-test-lead",
    "content": "updated-test-content",
    "tag_ids": [2],
    "public": true
  }

  var addedPostId;

  it("[GET /posts/] should get all post", done => {
    request("http://localhost:8081/api/posts/", (err, res) => {
      var jRes = JSON.parse(res.body)
      var singlePost = jRes.posts[0];

      // Test request
      res.should.have.status(200);
      jRes.status.should.equal("OK")  
    

      // Test the main object
      jRes.should.be.a('object');
      jRes.status.should.be.a('string');
      jRes.posts.should.be.a('array');
      jRes.posts.length.should.equal(10);

      // Test a single post
      singlePost.should.have.property("post_id")
      singlePost.post_id.should.be.a("number")
      singlePost.should.have.property("title")
      singlePost.title.should.be.a("string")
      singlePost.should.have.property("lead")
      singlePost.lead.should.be.a("string")
      singlePost.should.have.property("content")
      singlePost.content.should.be.a("string")
      singlePost.should.have.property("tags")
      singlePost.tags.should.be.a("array")
      singlePost.should.have.property("date")
      singlePost.date.should.be.a("string")
      singlePost.should.have.property("username")
      singlePost.username.should.be.a("string")
      done()
    })
  })
  
  it("[POST /posts/] should fail to add a post without an authorization-token ", done => {
    request({method: "POST", url: "http://localhost:8081/api/posts/", json: postToAdd}, (err, res) => {
      res.should.have.status(403)
      done()
    })
  })

  it("[POST /posts/] should add a post with an auth-token ", done => {
    var requestOptions = {
      method: "POST", 
      url: "http://localhost:8081/api/posts/", 
      json: postToAdd,
      auth: {
        'bearer': process.env.JWT_TESTING_TOKEN
      }
    }

    request(requestOptions, (err, res) => {
      res.should.have.status(200)
      res.body.status.should.equal("OK")  
      res.body.post.post_id.should.be.a("number");   
      res.body.status.should.be.a("string")
      res.body.post.title.should.equal("test-title")
      res.body.post.lead.should.equal("test-lead")
      res.body.post.content.should.equal("<p>test-content</p>\n")
      res.body.post.tag_ids.should.be.a("array")   
      addedPostId = res.body.post.post_id;   
      done()
    })   
  })
  
  
  it("[GET /posts/:postId] should get the added posts at ", done => {
    var requestUrl = "http://localhost:8081/api/posts/"+addedPostId;
    request(requestUrl, (err, res) => {
      res.should.have.status(200)
      res.body = JSON.parse(res.body)
      res.body.status.should.equal("OK")  
      res.body.post.post_id.should.equal(addedPostId)  
      res.body.post.title.should.equal("test-title")
      res.body.post.lead.should.equal("test-lead")
      res.body.post.content.should.equal("<p>test-content</p>\n")
      res.body.post.tags.should.be.a("array")
      done()
    })
  })

  it("[PUT /posts/:postId] should fail to update a single post without an auth-token at ", done => {
    var requestOptions = {
      method: "PUT", 
      url: "http://localhost:8081/api/posts/"+addedPostId, 
      json: updatedPostContent
    }
    request(requestOptions, (err, res) => {
      res.should.have.status(403)
      done()
    })
  })

  it("[PUT /posts/:postId] should update a single post on", done => {
    var requestOptions = {
      method: "PUT", 
      url: "http://localhost:8081/api/posts/"+addedPostId, 
      json: updatedPostContent,
      auth: {
        'bearer': process.env.JWT_TESTING_TOKEN
      }
    }
    request(requestOptions, (err, res) => {
      res.should.have.status(200)
      res.body.status.should.equal("OK")  
      res.body.post.post_id.should.equal(addedPostId)  
      res.body.post.title.should.equal("updated-test-title")
      res.body.post.lead.should.equal("updated-test-lead")
      res.body.post.content.should.equal("<p>updated-test-content</p>\n")
      res.body.post.tag_ids.should.deep.equal([2]);
      done()
    })
  })

  it("[DELETE /posts/:postId] should fail to delete a single post without an auth-token", done => {
    var requestOptions = {
      method: "DELETE", 
      url: "http://localhost:8081/api/posts/"+addedPostId
    }
    request(requestOptions, (err, res) => {
      res.should.have.status(403)
      done()
    })
  })

  it("[DELETE /posts/:postId] should delete a single post with an auth-token", done => {
    var requestOptions = {
      method: "DELETE", 
      url: "http://localhost:8081/api/posts/"+addedPostId, 
      auth: {
        'bearer': process.env.JWT_TESTING_TOKEN
      }
    }
    request(requestOptions, (err, res) => {
      res.should.have.status(200)
      res.body = JSON.parse(res.body);
      res.body.status.should.equal("OK")  
      res.body.post.post_id.should.equal(addedPostId)  
      done()
    })
  })

  it("[DELETE /posts/:postId] should return status OK with no post when deleting non-existing posts", done => {
    var requestOptions = {
      method: "DELETE", 
      url: "http://localhost:8081/api/posts/"+addedPostId, 
      auth: {
        'bearer': process.env.JWT_TESTING_TOKEN
      }
    }
    request(requestOptions, (err, res) => {
      res.should.have.status(200)
      res.body = JSON.parse(res.body);
      res.body.status.should.equal("OK")  
      done()
    })
  })
})