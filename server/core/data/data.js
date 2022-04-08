const { findItemInCollection, createUUID } = require('../utils/utils');

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

const db = {
	users: [{
		id: '5pX1D1OMy7fkr0wvmAW3CzvA6lK6',
		email: 'test@test.com',
		password: 'test',
		firstName: 'John',
		lastName: 'Appleseed',
		role: 'Dealer',
	}],
};

function findUser(values) {
	const user = findItemInCollection(values, db.users);
	return user ? new User(user) : null;
}

module.exports = {
	findUser,
};
