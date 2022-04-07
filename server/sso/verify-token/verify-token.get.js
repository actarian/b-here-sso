const Request = require('../../request/request');
const Cache = require('../../cache/cache');
const config = require('../sso.config');
const { requestToken } = require('../sso-token.service');

async function verifyTokenGet(req, res, next) {
	const bearer = Request.getAuthorizationBearer(req);
	const { verifyToken } = req.query;
	// if the application token is not present or verifyToken request is invalid
	// if the verifyToken is not present in the cache some is
	// smart.
	if (bearer == null || verifyToken == null || !Cache.hasToken(verifyToken)) {
		return res.status(400).json({ message: 'badRequest' });
	}
	// if the bearer is present and check if it's valid for the application
	const [sessionToken, appName] = Cache.getToken(verifyToken);
	// If the bearer is not equal to token given during the sso app registration or later stage than invalid
	const app = config.sso.apps.find(app => app.name === appName);
	if (!app || app.bearer !== bearer || !Cache.hasApplicationName(sessionToken, appName)) {
		return res.status(403).json({ message: 'Unauthorized' });
	}
	// checking if the token passed has been generated
	const token = await requestToken(verifyToken);
	Cache.deleteToken(verifyToken);
	return res.status(200).json({ token });
};

module.exports = verifyTokenGet;
