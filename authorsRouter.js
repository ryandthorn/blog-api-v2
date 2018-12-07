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
  Author
    .find()
    .then(authors => {
      res.json({
        authors: authors.map(author => {
          return {
            firstName: author.firstName,
            lastName: author.lastName,
            userName: author.userName
          }
        })
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'userName'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing field '${field}' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Author
    .create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName
    })
    .then(author => {
      res.status(201).json({
        _id: author._id,
        name: `${author.firstName} ${author.lastName}`,
        userName: author.userName
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', (req, res) => {
  if (!(req.body.id && req.params.id && req.body.id === req.params.id)) {
    const message = `Error: request body id (${req.body.id}) and request parameters id (${req.params.id}) must match.`;
    console.error(message);
    return res.status(400).send(message);
  }

  const toUpdate = {};
  const updateableFields = ['firstName', 'lastName', 'userName'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Author
    .findByIdAndUpdate(req.params.id, { $set: toUpdate }, { new: true })
    .then(author => res.status(200).json({
      _id: author._id,
      name: `${author.firstName} ${author.lastName}`,
      userName: author.userName
    }))
    .catch(err => {
      console.error(err);
      return res.status(500).json({ message: `Internal server error` });
    })
});

router.delete('/:id', (req, res) => {
  Author
    .findByIdAndDelete(req.params.id)
    .then(author => res.status(204).end())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    })
});

module.exports = router;