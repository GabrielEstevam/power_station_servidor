const express = require('express');

const routes = express.Router();

routes.get('/', (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
});

routes.post('/login', (req,res) => {
    //console.log("User name = "+user_name+", password is "+password);
    console.log("foi");
    res.end("yes");
  });
  

module.exports = routes;