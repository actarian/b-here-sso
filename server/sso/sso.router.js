const express = require('express');
const router = express.Router();

const indexGet = require('./index/index.get');
const loginGet = require('./login/login.get');
const loginPost = require('./login/login.post');
const registerGet = require('./register/register.get');
const registerPost = require('./register/register.post');
const logoutGet = require('./logout/logout.get');
const verifyTokenGet = require('./verify-token/verify-token.get');

router.route('/')
	.get(indexGet);

router.route('/login')
	.get(loginGet)
	.post(loginPost);

router.route('/register')
	.get(registerGet)
	.post(registerPost);

router.route('/logout')
	.get(logoutGet);

router.route('/verifytoken')
	.get(verifyTokenGet);

module.exports = router;
