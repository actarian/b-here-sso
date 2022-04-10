
const URL = require('url').URL;
const { createUUID } = require('../core/utils/utils');
const Cookie = require('../core/cookie/cookie');
const Token = require('../core/token/token');

function authUser(req, res, user) {
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

module.exports = authUser;
