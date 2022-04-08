const Request = require('../../request/request');
const Cache = require('../../cache/cache');
const config = require('../sso.config');
const { requestToken } = require('../sso-token.service');
const Cookie = require('../../cookie/cookie');

async function verifyTokenGet(req, res, next) {
	const bearer = Request.getAuthorizationBearer(req);
	const { verifyToken } = req.query;
	// if the application token is not present or verifyToken request is invalid
	// if the verifyToken is not present in the cache some is
	// smart.
	const identity = Cookie.get(req, 'identity');
	const verify = verifyToken ? Cookie.get(req, 'verify') : null;
	console.log(identity, verify, bearer, identity);
	if (bearer == null || verifyToken == null || identity == null || verify == null) {
		return res.status(400).json({ message: 'badRequest' });
	}
	// if the bearer is present and check if it's valid for the application
	const app = config.sso.apps.find(app => app.origin === verify.origin);

	if (!app || app.secret !== bearer) {
		return res.status(403).json({ message: 'Unauthorized' });
	}

	// checking if the token passed has been generated
	const token = await requestToken(verify, identity);

	Cookie.delete('verify');
	return res.status(200).json({ token });
};

module.exports = verifyTokenGet;
