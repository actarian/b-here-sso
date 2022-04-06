
const URL = require('url').URL;
const { db, createUUID } = require('../../../data/data');
const Cache = require('../../../cache/cache');

function loginPost(req, res, next) {
	// do the validation with email and password
	// but the goal is not to do the same in this right now,
	// like checking with Datebase and all, we are skiping these section
	const { email, password } = req.body;
	if (!(db.users[email] && password === db.users[email].password)) {
		return res.status(404).json({ message: 'Invalid email and password' });
	}

	// else redirect
	const { redirectUrl } = req.query;
	const id = createUUID();
	req.session.user = id;
	Cache.setUser(id, email);
	if (redirectUrl == null) {
		return res.redirect('/');
	}
	const url = new URL(redirectUrl);
	const ssoToken = createUUID();
	Cache.cacheApplication(url.origin, id, ssoToken);
	return res.redirect(`${redirectUrl}?ssoToken=${ssoToken}`);
};

module.exports = loginPost;
