const jwt = require('jsonwebtoken');
const config = require('./sso.config');

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

function getTokenPayload(sessionId, user, app) {
	console.log('TokenService.getTokenPayload', user, app);
	const userPayload = user.getPayload(app.scope);
	return {
		sessionId: sessionId,
		user: userPayload,
		app: {
			name: app.name,
			scope: app.scope,
		}
	};
}

function requestToken(sessionId, user, app) {
	const payload = getTokenPayload(sessionId, user, app);
	return createToken(payload);
}

module.exports = {
	createToken,
	getTokenPayload,
	requestToken,
};
