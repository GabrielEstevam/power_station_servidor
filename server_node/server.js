var express = require("express");
var bodyParser = require("body-parser");

const routes = require('./routes.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => {
  console.log("Started on PORT 3000");
})

app.use(routes);