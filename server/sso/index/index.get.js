const { findUser } = require('../../core/data/data');
const Cookie = require('../../core/cookie/cookie');
const Token = require('../../core/token/token');

function indexGet(req, res, next) {
	let user = null;
	const identity = Cookie.get(req, 'identity');
	if (identity) {
		Token.set(identity.id, identity);
		user = findUser({ id: identity.userId });
	}
	return res.render('index', {
		title: 'BHere SSO - Index',
		user: JSON.stringify(user),
	});
};

module.exports = indexGet;
