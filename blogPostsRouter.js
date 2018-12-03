const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { BlogPosts } = require('./models');

router.get('/', (req, res) => {
  BlogPosts
    .find()
    .then(posts => {
      res.json({
        posts: posts.map(posts => posts.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.get('/:id', (req, res) => {
  BlogPosts
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = router;