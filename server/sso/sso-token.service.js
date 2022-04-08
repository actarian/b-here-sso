const jwt = require('jsonwebtoken');
const Cache = require('../cache/cache');
const config = require('./sso.config');
const { findUser } = require('../data/data');

function createToken(payload) {
	return new Promise((resolve, reject) => {
		// some of the libraries and libraries written in other language,
		// expect base64 encoded secrets, so sign using the base64 to make
		// jwt useable across all platform and langauage.
		payload = Object.assign({}, payload);
		options = { algorithm: 'RS256', expiresIn: '1h', issuer: config.sso.issuer };
		jwt.sign(payload, config.sso.privateKey, options, (error, token) => {
			if (error) {
				return reject(error);
			}
			return resolve(token);
		});
	});
}

function getTokenPayload(verify, identity) {
	const user = findUser({ id: identity.userId });
	const app = config.sso.apps.find(app => app.origin === verify.origin);
	console.log('TokenService.getTokenPayload', identity.id, user, app);
	const userPayload = user.getPayload(app.scope);
	return {
		session: identity.id,
		user: userPayload,
		app: {
			name: app.name,
			scope: app.scope,
		}
	};
}

function requestToken(verify, identity) {
	const payload = getTokenPayload(verify, identity);
	return createToken(payload);
}

module.exports = {
	createToken,
	getTokenPayload,
	requestToken,
};
