const express = require('express');
const api = require('./src/api');
const sql = require('./db');

const routes = express.Router();

// PAGES

routes.get('/', (req,res) => {
    res.sendFile(__dirname + "/public/index.html");
});

routes.get('/main', (req,res) => {
    res.sendFile(__dirname + "/public/main.html");
})

routes.get('/store', (req,res) => {
    res.sendFile(__dirname + "/public/store.html");
});

// AUTH

routes.get('/signup', (req,res) => {
    res.sendFile(__dirname + "/public/signup.html");
})

routes.post('/login', async (req, res) => {
    let {user, password} = req.body;
    let response = await sql.validateLogin(user, password);

    res.status(200).send(response);
});

routes.post('/validateSignin', async (req, res) => {
    let response = {};
    let {name, user, password} = req.body;
    let validation = await sql.validateSignin(user);
    response.validation = !validation.user;

    if(response.validation){
        let signResponse = await sql.signIn(name, user, password);
        if(signResponse.error)
            response.error = signResponse.error;
    }

    console.log(response);

    res.status(200).send(response);
});

// DATA FROM DB

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
});

routes.get('/relays', async (req, res) => {
    const relaysRes = await sql.getRelays();

    if(relaysRes.error)
        res.status(400).send({error: "Relays not found"});
    else
        res.status(200).send(relaysRes.relays);
});

/* routes.get('/login', async (req,res) => {
    const response = await api.get('/');
    console.log(response.data);

    res.status(200).send({succes: "Deu bom"});
});
   */

module.exports = routes;