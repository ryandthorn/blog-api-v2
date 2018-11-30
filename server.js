const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.listen(process.env.PORT || 8080, () => {
  console.log(`Blog API is listening on port ${process.env.PORT || 8080}`);
});