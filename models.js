'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    unique: true
  }
});

const commentSchema = mongoose.Schema({ content: String });

const blogPostSchema = mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  content: String,
  created: Date,
  comments: [commentSchema]
});

// Note: findById is findOne under the hood
blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
})
blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
})

blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
});

blogPostSchema.methods.serialize = function() {
  return {
    id: this.id,
    title: this.title,
    author: this.authorString,
    content: this.content,
    created: this.created,
    comments: this.comments
  }
};

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = { Author, BlogPost };
