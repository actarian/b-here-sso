const Request = require('../../../request/request');
const Cache = require('../../../cache/cache');
const config = require('../../../config/config');
const { requestToken } = require('../token.service');

async function verifyTokenGet(req, res, next) {
	const appToken = Request.getAuthorizationBearer(req);
	const { ssoToken } = req.query;
	// if the application token is not present or ssoToken request is invalid
	// if the ssoToken is not present in the cache some is
	// smart.
	if (appToken == null || ssoToken == null || !Cache.hasToken(ssoToken)) {
		return res.status(400).json({ message: 'badRequest' });
	}
	// if the appToken is present and check if it's valid for the application
	const [globalSessionToken, appName] = Cache.getToken(ssoToken);
	// If the appToken is not equal to token given during the sso app registration or later stage than invalid
	if (appToken !== config.tokens[appName] || !Cache.hasApplicationName(globalSessionToken, appName)) {
		return res.status(403).json({ message: 'Unauthorized' });
	}
	// checking if the token passed has been generated
	const token = await requestToken(ssoToken);
	Cache.deleteToken(ssoToken);
	return res.status(200).json({ token });
};

module.exports = verifyTokenGet;
