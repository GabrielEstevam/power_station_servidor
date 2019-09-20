const express = require('express');
const api = require('./src/api');
const sql = require('./db');

const routes = express.Router();

routes.get('/', (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
});

routes.get('/main', (req,res) => {
    res.sendFile(__dirname + "/public/main.html");
})

routes.get('/user/:id', async (req, res) => {
    if(!req.params){
        res.status(500).send({error: "Id is missing"});
    }
    else{
        const user = await sql.getUserById(req.params.id);

        if(user.error)
            res.status(503).send({error: "Id is missing"});
        else
            res.status(200).send(user);
    }
})

routes.post('/login', async (req, res) => {
    let {user, password} = req.body;
    let response = await sql.validateLogin(user, password);

    res.status(200).send(response);
});

/* routes.get('/login', async (req,res) => {
    const response = await api.get('/');
    console.log(response.data);

    res.status(200).send({succes: "Deu bom"});
});
   */

module.exports = routes;