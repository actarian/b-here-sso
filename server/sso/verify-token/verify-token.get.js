const Request = require('../../core/request/request');
const { requestToken } = require('../sso-token.service');
const Token = require('../../core/token/token');
const { findUser, findAppByOriginAndBearer } = require('../../core/data/data');

// !!! server to server, no cookies here
async function verifyTokenGet(req, res, next) {
	const { verifyToken } = req.query;
	// console.log('verifyTokenGet.verifyToken', verifyToken);
	if (!verifyToken) {
		return res.status(400).json({ message: 'badRequest' });
	}
	const verify = Token.get(verifyToken);
	// console.log('verifyTokenGet.verify', verify);
	if (!verify) {
		return res.status(400).json({ message: 'badRequest' });
	}
	const bearer = Request.getAuthorizationBearer(req);
	// console.log('verifyTokenGet.bearer', bearer);
	if (!bearer) {
		return res.status(400).json({ message: 'badRequest' });
	}
	const app = findAppByOriginAndBearer(verify.origin, bearer);
	// console.log('verifyTokenGet.app', app);
	if (!app) {
		return res.status(403).json({ message: 'Unauthorized' });
	}
	const identity = Token.get(verify.identityId);
	// console.log('verifyTokenGet.identity', identity);
	if (!identity) {
		return res.status(403).json({ message: 'Unauthorized' });
	}
	const user = findUser({ id: identity.userId });
	// console.log('verifyTokenGet.user', user);
	if (!user) {
		return res.status(404).json({ message: 'Not Found' });
	}
	const token = await requestToken(identity.id, user, app);
	// console.log('verifyTokenGet.token', token);
	Token.delete(verifyToken);
	return res.status(200).json({ token });
};

module.exports = verifyTokenGet;
