const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('First Post', 'Lorem ipsum dolor', 'Author 1');
BlogPosts.create('Second Post', 'Lorem ipsum dolor', 'Author 2');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field in req.body) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }  
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field in req.body) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }  
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id} and request body id (${req.body.id}) must match)`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item with ID: '${req.params.id}'`);
  const updatedItem = BlogPosts.update({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate || Date.now()
  });
  res.status(200).json(updatedItem);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post with ID: ${req.params.ID}`);
  res.status(204).end();
});

module.exports = router;