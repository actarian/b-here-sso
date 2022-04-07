const jwt = require('jsonwebtoken');
const Cache = require('../../cache/cache');
const config = require('../../config/config');
const { db, findUser } = require('../../data/data');
const keys = config.keys;
const ssoPrivateKey = keys.ssoPrivateKey;

function createToken(payload) {
	return new Promise((resolve, reject) => {
		// some of the libraries and libraries written in other language,
		// expect base64 encoded secrets, so sign using the base64 to make
		// jwt useable across all platform and langauage.

		payload = { ...payload };
		options = { algorithm: 'RS256', expiresIn: '1h', issuer: config.issuer };

		jwt.sign(payload, ssoPrivateKey, options, (error, token) => {
			if (error) {
				return reject(error);
			}
			return resolve(token);
		});
	});
}

function getTokenPayload(ssoToken) {
	const [globalSessionToken, appName] = Cache.getToken(ssoToken);
	const email = Cache.getUser(globalSessionToken);
	const user = findUser({ email });
	const appPolicy = user.appPolicy[appName];
	const email = appPolicy.shareEmail === true ? email : undefined;
	const payload = {
		...appPolicy,
		email,
		shareEmail: undefined,
		uid: user.userId,
		// global SessionID for the logout functionality.
		globalSessionID: globalSessionToken
	};
	return payload;
}

function requestToken(ssoToken) {
	const payload = getTokenPayload(ssoToken);
	return createToken(payload);
}

module.exports = {
	createToken,
	getTokenPayload,
	requestToken,
};
