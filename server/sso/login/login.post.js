const { findUser } = require('../../core/data/data');
const authUser = require('../sso.auth');

function loginPost(req, res, next) {
	// do the validation with email and password
	// but the goal is not to do the same in this right now,
	// like checking with Datebase and all, we are skiping these section
	const { email, password } = req.body;
	const user = findUser({ email, password });
	if (!user) {
		return res.status(404).json({ message: 'Invalid email and password' });
	}
	return authUser(req, res, user);
};

module.exports = loginPost;
