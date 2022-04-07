const { findItemInCollection, createUUID } = require('../shared/utils');

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
	findUser,
	findPolicy,
};
