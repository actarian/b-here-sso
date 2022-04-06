const uuidv4 = require('uuid/v4');
const Hashids = require('hashids');
const hashids = new Hashids();

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, '');
const createUUID = () => hashids.encodeHex(deHyphenatedUUID());

const db = {
	users: {
		'test@test.com': {
			password: 'test',
			userId: createUUID(), // incase you dont want to share the user-email.
			appPolicy: {
				sso_consumer: { role: 'admin', shareEmail: true },
				simple_sso_consumer: { role: 'user', shareEmail: false }
			},
		}
	}
}

module.exports = {
	createUUID,
	db
};
