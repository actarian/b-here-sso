
const URL = require('url').URL;
const { createUUID } = require('../../core/utils/utils');
const Cookie = require('../../core/cookie/cookie');
const Token = require('../../core/token/token');
const { findAppByOrigin } = require('../../core/data/data');

function registerGet(req, res, next) {
	// The req.query will have the redirect url where we need to redirect after successful
	// register and with sso token.
	// This can also be used to verify the origin from where the request has came in
	// for the redirection
	const { redirectUrl } = req.query;
	// direct access will give the error inside new URL.
	if (redirectUrl != null) {
		const url = new URL(redirectUrl);
		const app = findAppByOrigin(url.origin);
		if (!app) {
			return res
				.status(400)
				.json({ message: 'Your are not allowed to access the sso-server' });
		}
	}
	return res.render('register', {
		title: 'SSO-Server | register'
	});
};

module.exports = registerGet;
