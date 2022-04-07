const express = require('express');
const router = express.Router();

const loginGet = require('./login/login.get');
const loginPost = require('./login/login.post');
const logoutGet = require('./logout/logout.get');
const verifyTokenGet = require('./verify-token/verify-token.get');

router.route('/login')
	.get(loginGet)
	.post(loginPost);

router.route('/logout')
	.get(logoutGet);

router.route('/verifytoken')
	.get(verifyTokenGet);

module.exports = router;
