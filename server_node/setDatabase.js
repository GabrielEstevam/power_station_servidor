/*

RUN THIS FILE BEFORE RUNNING THE SERVER!

Objectives:
	This file is meant to be used for setting the inicial database configurations, such as tables and relations between them.

	Head to the terminal in this folder, with Node.js installed, and type: node setDatabase.js
	The file will them set your database and make it ready to use.

*/

const sql = require('./db.js');
const fs = require('fs');

fs.readFile('./db/script.sql', 'utf8', function(err, contents){
	if(err) return console.log('Error reading database file');

	fs.writeFile('./powerstation.db', '', () => {
		console.log('Previous database information erased.');
	})

	sql.exec(contents);

	let admin = {
        username: 'admin',
		name: 'admin',
        password: 'admin',
        credit: 0,
	}

	sql.run("INSERT INTO Users(username, name, password, credit) VALUES(?, ?, ?, ?)", [
		admin.username.toLowerCase(),
		admin.name.toLowerCase(),
		admin.password,
		admin.credit,
	]);

	sql.run("INSERT INTO Relays(inUse, remainingTime, id_user) VALUES (0, 0, 0), (0, 0, 0), (0, 0, 0), (0, 0, 0)");
});