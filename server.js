const express = require('express');
const morgan = require('morgan');

const app = express();
const blogPostsRouter = require('/blogPosts')

app.use(morgan('common'));

app.use('/blog-posts', blogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Blog API is listening on port ${process.env.PORT || 8080}`);
});