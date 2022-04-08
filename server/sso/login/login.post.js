
const URL = require('url').URL;
const { createUUID } = require('../../core/utils/utils');
const { findUser } = require('../../core/data/data');
const Cookie = require('../../core/cookie/cookie');
const Token = require('../../core/token/token');

function loginPost(req, res, next) {
	// do the validation with email and password
	// but the goal is not to do the same in this right now,
	// like checking with Datebase and all, we are skiping these section
	const { email, password } = req.body;
	const user = findUser({ email, password });
	if (!user) {
		return res.status(404).json({ message: 'Invalid email and password' });
	}

	const identity = { id: createUUID(), userId: user.id };
	Cookie.set(req, res, 'identity', identity);
	Token.set(identity.id, identity);

	const { redirectUrl } = req.query;
	if (redirectUrl == null) {
		return res.redirect('/');
	}

	const url = new URL(redirectUrl);
	const origin = url.origin;

	const verify = { id: createUUID(), identityId: identity.id, origin, expireAt: new Date(Date.now() + 30 * 1000) }; // 30 seconds
	Token.set(verify.id, verify);

	return res.redirect(`${redirectUrl}?verifyToken=${verify.id}`);
};

module.exports = loginPost;
