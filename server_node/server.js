const express = require("express");
const bodyParser = require("body-parser");

const routes = require('./routes.js');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => {
  console.log("Started on PORT 3000");
})

app.use(routes);
app.use('/public', express.static('public'))
app.use('/img', express.static('src/img'))
