
const { addUser } = require('../../core/data/data');
const authUser = require('../sso.auth');

function registerPost(req, res, next) {
	const { firstName, lastName, email, password } = req.body;
	const user = addUser({ firstName, lastName, email, password, role: 'Dealer' });
	return authUser(req, res, user);
};

module.exports = registerPost;
