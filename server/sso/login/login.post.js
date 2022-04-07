
const URL = require('url').URL;
const { createUUID } = require('../../shared/utils');
const { findUser } = require('../../data/data');
const Cache = require('../../cache/cache');
const Cookie = require('../../cookie/cookie');

function loginPost(req, res, next) {
	// do the validation with email and password
	// but the goal is not to do the same in this right now,
	// like checking with Datebase and all, we are skiping these section
	const { email, password } = req.body;
	const user = findUser({ email, password });
	if (!user) {
		return res.status(404).json({ message: 'Invalid email and password' });
	}

	// !!!
	const id = createUUID();
	req.session.user = id;
	Cache.setUser(id, email);

	const identityCookie = { id: createUUID(), userId: user.id };
	Cookie.set(req, res, 'identity', identityCookie);

	const { redirectUrl } = req.query;
	if (redirectUrl == null) {
		return res.redirect('/');
	}

	const url = new URL(redirectUrl);
	const origin = url.origin;

	const verifyCookie = { id: createUUID(), identityId: identityCookie.id, origin };
	Cookie.set(req, res, 'verify', verifyCookie, 30 * 1000); // 30 seconds

	const verifyToken = createUUID();
	Cache.cacheApplication(origin, id, verifyToken);
	return res.redirect(`${redirectUrl}?verifyToken=${verifyToken}`);

	/*
	to get a cookie from an incoming request ..
	let cookie = req.cookies['cookiename'];
	to set a response cookie (this cookie will be sent on all future incoming requests until deletion or expiration) ..
	res.cookie('cookiename', 'cookievalue', {
		maxAge: 86400 * 1000, // 24 hours
		httpOnly: true, // http only, prevents JavaScript cookie access
		secure: (req.protocol === 'https') // cookie must be sent over https / ssl
	});
	to delete a response cookie ..
	res.cookie('cookiename', 'cookievalue', {
		maxAge: 0
	});
	*/

};

module.exports = loginPost;
