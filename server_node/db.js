
//Path to the database
const dbPath = 'powerstation.db';

//Modules
const Conn = require('./models/Conn.js');
const db = new Conn(dbPath);


//GET
db.getUserById = async function(id){
	let user = {};
	let error = null;

	await this.get("SELECT id_user, username, name, credit FROM Users WHERE id_user = ?", [id])
	.then((result) => {
		if(result !== undefined)
			user = result;
		else
			error = "Error getting user by id";
	})

	return {error, user};
}

db.getUsers = async function(){
	let users = {};
	let error = null;

	await this.all("SELECT id_user, username, name, credit FROM Users")
	.then((result) => {
		if(result !== undefined)
			users = result;
		else
			error = "Error getting users";
	});

	return {users, error};
}

db.getRelays = async function(){
	let relays = {};
	let error = null;

	await this.all("SELECT id_relay, inUse, remainingTime, id_user FROM Relays")
	.then((result) => {
		if(result !== undefined)
			relays = result;
		else
			error = "Error getting relays";
	});

	return {relays, error};
}

//POST

db.updateRelay = async function(relay){
	let data = {success: false};

	await this.run("UPDATE Relays SET inUse = ?, remainingTime = ?, id_user = ? WHERE id_relay = ?",[relay.inUse, relay.remainingTime, relay.id_user, relay.id_relay])
	.then((result) => {
		if(result !== undefined)
			data.success = true;
	})
	.catch((err) => {
		console.log(`Error activating relay ${id_relay}: `, err);
		data.error = err;
	})

	return data;
}

db.buyCredits = async function(time, idUser){
	let data = {success: false};

	await this.run("UPDATE Users SET credit = credit + ? WHERE id_user = ? ", [time , idUser])
	.then((result) => {
		if (result !== undefined)
			data.success = true
		
	})
	.catch((err) => {
		console.log("Error validating sign in: ", err);
		data.error = err;
	})

	return data; // retorna dados para a rota
}

db.activateRelay = async function(id_user, id_relay, credit){
	let data = {success: false};

	await this.run("UPDATE Relays SET inUse = 1, remainingTime = ?, id_user = ? WHERE id_relay = ?",[credit, id_user, id_relay])
	.then((result) => {
		if(result !== undefined)
			data.success = true;
	})
	.catch((err) => {
		console.log(`Error activating relay ${id_relay}: `, err);
		data.error = err;
	})

	return data;
}

db.deactivateRelay = async function(id_user, id_relay){
	let data = {success: false};

	await this.run("UPDATE Relays SET inUse = 0, remainingTime = 0, id_user = 0 WHERE id_relay = ? AND id_user = ?",[id_relay, id_user])
	.then((result) => {
		if(result !== undefined)
			data.success = true;
	})
	.catch((err) => {
		console.log(`Error deactivating relay ${id_relay}: `, err);
		data.error = err;
	})

	return data;
}

//VALIDATE

db.validateSignin = async function(user){
	let data = {user: false};

	await this.all("SELECT name FROM Users WHERE name=? ", [user])
	.then((result) => {
		if(result !== undefined){
			result.forEach((row) => {
				if(row.name.toLowerCase() == user.toLowerCase())
					data.user = true;
			});
		}
	})
	.catch((err) => {
		console.log("Error validating sign in: ", err);
	})

	return data;
}

db.validateLogin = async function(user, password){
	let data = {validation: true };

	await this.get("SELECT id_user FROM Users WHERE username = ? AND password = ?", [user.toLowerCase(), password])
	.then(async (res) => {
		if(res !== undefined)
			data.id = res.id_user;
		else
			data.validation = false;
	})
	.catch(async err => {
		data.error = err;
	})

	return data;
}

db.signIn = async function(name, user, password){
	let data = {};

	await this.run("INSERT INTO Users(username, name, password, credit) VALUES (?, ?, ?, 0)", [user.toLowerCase(), name.toLowerCase(), password])
	.then(async res => {
		if(res !== undefined)
			data.success = true;
	})
	.catch(async err => data.error = err);

	return data;
}

module.exports = db;

