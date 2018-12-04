const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

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

router.put('/:id', (req, res) => {
  // Check for both ids and make sure they match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPosts
    .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
    .then(post => res.status(200).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
});

router.delete('/:id', (req, res) => {
  BlogPosts
    .findByIdAndDelete(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

module.exports = router;