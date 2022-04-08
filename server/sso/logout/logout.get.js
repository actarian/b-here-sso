
const URL = require('url').URL;
const config = require('../sso.config');
const Cache = require('../../cache/cache');
const Cookie = require('../../cookie/cookie');

function logoutGet(req, res, next) {
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

	Cookie.delete(res, 'identity');

	if (redirectUrl == null) {
		return res.redirect('/');
	}

	if (redirectUrl != null) {
		// const url = new URL(redirectUrl);
		return res.redirect(`${redirectUrl}`);
	}

	return res.render('logout', {
		title: 'SSO-Server | Logout'
	});
};

module.exports = logoutGet;
