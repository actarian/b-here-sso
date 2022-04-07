const uuidv4 = require('uuid/v4');
const Hashids = require('hashids');
const hashids = new Hashids();

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, '');
const createUUID = () => hashids.encodeHex(deHyphenatedUUID());

// install extensions
// es6-string-html
// es6-string-javascript
// ESLint
// TSLint

const userId = createUUID();

const db = {
	users: [{
		id: userId,
		email: 'test@test.com',
		password: 'test',
		firstName: 'John',
		lastName: 'Appleseed',
		role: 'Dealer',
	}],
	policies: [{
		userId: userId,
		appName: 'bhere-sso-consumer',
		scope: 'id, firstName, lastName, email, role',
	}],
};

function findItemInCollection(values, collection) {
	const keys = Object.keys(values);
	const index = collection.reduce((p, c, i) => {
		const match = keys.reduce((m, key) => {
			return m && c[key] === values[key];
		}, true);
		return match ? i : p;
	}, -1);
	if (index !== -1) {
		return collection[index];
	} else {
		return null;
	}
}

function findUser(values) {
	const user = findItemInCollection(values, db.users);
	return user ? new User(user) : null;
}

function findPolicy(values) {
	const policy = findItemInCollection(values, db.policies);
	return policy || null;
}

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

module.exports = {
	db,
	findItemInCollection,
	findUser,
	findPolicy,
	createUUID,
	User,
};
