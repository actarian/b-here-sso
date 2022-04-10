const { findItemInCollection, createUUID, saveData, readFileSync } = require('../utils/utils');

class User {

	constructor(user) {
		if (typeof user === 'object') {
			Object.assign(this, user);
		}
	}

	getPayload(scope) {
		const user = {};
		const keys = Array.isArray(scope) ? scope : (scope.split(',').map(x => x.trim()));
		keys.forEach(key => {
			user[key] = this[key];
		});
		return user;
	}

}

const SSO_DB = process.env.SSO_DB || readFileSync(__dirname, '../../../data/data.json');
const db = JSON.parse(SSO_DB);

function addUser(user) {
	user.id = createUUID();
	db.users.push(user);
	saveData(db, __dirname, '../../../data/data.json').then(() => {
		console.log('Data.saveData');
	});
	return new User(user);
}

function findUser(values) {
	const user = findItemInCollection(values, db.users);
	return user ? new User(user) : null;
}

function findApp(values) {
	const app = findItemInCollection(values, db.apps);
	return app ? app : null;
}

function findAppByOrigin(origin) {
	return db.apps.find(app => app.origin.split(',').map(x => x.trim()).includes(origin)) || null;
}

function findAppByOriginAndBearer(origin, bearer) {
	return db.apps.find(app => app.secret === bearer && app.origin.split(',').map(x => x.trim()).includes(origin)) || null;
}

module.exports = {
	addUser,
	findUser,
	findApp,
	findAppByOrigin,
	findAppByOriginAndBearer,
};
