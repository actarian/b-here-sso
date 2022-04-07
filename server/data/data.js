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

const db = {
	users: [{
		email: 'test@test.com',
		password: 'test',
		userId: createUUID(), // incase you dont want to share the user-email.
		appPolicy: {
			sso_consumer: { role: 'admin', shareEmail: true },
			simple_sso_consumer: { role: 'user', shareEmail: false }
		},
	}],
};

function findUser(values) {
	const keys = Object.keys(values);
	const index = users.reduce((p, c, i) => {
		const match = keys.reduce((m, key) => {
			return m && c[key] === values[key];
		}, true);
	}, -1);
	if (index !== -1) {
		return users[index];
	} else {
		return null;
	}
}

module.exports = {
	createUUID,
	db,
	findUser,
};
