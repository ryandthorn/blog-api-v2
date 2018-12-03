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

router.post('/', (req, res) => {
  const requiredFields = ['title', 'author', 'content'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  BlogPosts
    .create({
      title: req.body.title,
      author: req.body.author,
      content: req.body.content,
      created: Date.now()
    })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;