'use strict';
const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: String,
  author: { 
    firstName: String, 
    lastName: String
  },
  content: String,
  created: Date
});

blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`;
});

blogPostSchema.methods.serialize = function() {
  return {
    title: this.title,
    author: this.authorString,
    content: this.content,
    created: this.created
  }
};

const BlogPosts = mongoose.model('Posts', blogPostSchema);

module.exports = { BlogPosts };
