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
router.post('/', jsonParser, (req, res) => {});
router.put('/:id', jsonParser, (req, res) => {});
router.delete('/:id', (req, res) => {});

module.exports = router;