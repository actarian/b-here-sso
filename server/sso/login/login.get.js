
const URL = require('url').URL;
const { createUUID } = require('../../shared/utils');
const config = require('../sso.config');
const Cache = require('../../cache/cache');

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

	if (req.session.user != null && redirectUrl == null) {
		return res.redirect('/');
	}

	// if global session already has the user directly redirect with the token
	if (req.session.user != null && redirectUrl != null) {
		const url = new URL(redirectUrl);
		const verifyToken = createUUID();
		Cache.cacheApplication(url.origin, req.session.user, verifyToken);
		return res.redirect(`${redirectUrl}?verifyToken=${verifyToken}`);
	}

	return res.render('login', {
		title: 'SSO-Server | Login'
	});
};

module.exports = loginGet;
