const jwt = require('jsonwebtoken');
const Cache = require('../cache/cache');
const config = require('./sso.config');
const { findUser } = require('../data/data');

function createToken(payload) {
	return new Promise((resolve, reject) => {
		// some of the libraries and libraries written in other language,
		// expect base64 encoded secrets, so sign using the base64 to make
		// jwt useable across all platform and langauage.
		payload = { ...payload };
		options = { algorithm: 'RS256', expiresIn: '1h', issuer: config.sso.issuer };
		jwt.sign(payload, config.sso.privateKey, options, (error, token) => {
			if (error) {
				return reject(error);
			}
			return resolve(token);
		});
	});
}

function getTokenPayload(verifyToken) {
	const [sessionToken, appName] = Cache.getToken(verifyToken);
	let email = Cache.getUser(sessionToken);
	const user = findUser({ email });
	const app = config.sso.apps.find(app => app.name === appName);
	// const policy = findPolicy({ userId: user.id, appName });
	// console.log('TokenService.getTokenPayload', sessionToken, appName, user, policy);
	console.log('TokenService.getTokenPayload', sessionToken, user, app);
	const userPayload = user.getPayload(app.scope);
	return {
		sessionToken: sessionToken,
		user: userPayload,
		app: {
			name: app.name,
			scope: app.scope,
		}
	};
}

function requestToken(verifyToken) {
	const payload = getTokenPayload(verifyToken);
	return createToken(payload);
}

module.exports = {
	createToken,
	getTokenPayload,
	requestToken,
};
