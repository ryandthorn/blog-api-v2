const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const morgan = require('morgan');
router.use(morgan('common'));

// Fix deprecation warnings
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

const { Author, BlogPost } = require('./models');

router.get('/', (req, res) => {
  BlogPost
    .find()
    .then(posts => {
      res.json({
        posts: posts.map(post => post.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['title', 'author_id', 'content'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Author
    .findById(req.body.author_id)
    .then(author => {
      if (author) {
        BlogPost
          .create({
            title: req.body.title,
            author: req.body.author_id,
            content: req.body.content,
            created: Date.now()
          })
          .then(post => {
            res.status(201).json({
              id: post.id,
              author: `${author.firstName} ${author.lastName}`,
              content: post.content,
              title: post.title,
              comments: post.comments
            })
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error - blogposts collection' });
        });
      } else {
        res.status(400).json({ message: "Author not found" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error - author collection" });
    })
});

router.put('/:id', (req, res) => {
  // Check for both ids and make sure they match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  BlogPost
    .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
    .populate('author')
    .then(post => res.status(200).json(post.serialize())) 
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
});

router.delete('/:id', (req, res) => {
  BlogPost
    .findByIdAndDelete(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error'});
    });
});

module.exports = router;