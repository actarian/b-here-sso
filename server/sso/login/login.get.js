
const URL = require('url').URL;
const { createUUID } = require('../../core/utils/utils');
const config = require('../sso.config');
const Cookie = require('../../core/cookie/cookie');
const Token = require('../../core/token/token');

function loginGet(req, res, next) {
	// The req.query will have the redirect url where we need to redirect after successful
	// login and with sso token.
	// This can also be used to verify the origin from where the request has came in
	// for the redirection
	const { redirectUrl } = req.query;
	// direct access will give the error inside new URL.
	if (redirectUrl != null) {
		const url = new URL(redirectUrl);
		const app = config.sso.apps.find(app => app.origin === url.origin);
		if (!app) {
			return res
				.status(400)
				.json({ message: 'Your are not allowed to access the sso-server' });
		}
	}

	const identity = Cookie.get(req, 'identity');
	if (identity != null) {
		Token.set(identity.id, identity);
		// if global session already has the user directly redirect with the token
		if (redirectUrl != null) {
			const url = new URL(redirectUrl);
			const origin = url.origin;
			const verify = { id: createUUID(), identityId: identity.id, origin, expireAt: new Date(Date.now() + 30 * 1000) }; // 30 seconds
			Token.set(verify.id, verify);
			return res.redirect(`${redirectUrl}?verifyToken=${verify.id}`);
		} else {
			return res.redirect('/');
		}
	}

	return res.render('login', {
		title: 'SSO-Server | Login'
	});
};

module.exports = loginGet;
