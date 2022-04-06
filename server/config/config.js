const keys = require('./keys/keys');

const ORIGIN_APP_NAME = {
	'http://localhost:3020': 'sso_consumer',
};

const ALLOWED_ORIGIN = {
	'http://localhost:3020': true,
};

// app token to validate the request is coming from the authenticated server only.
const TOKENS = {
	sso_consumer: 'l1Q7zkOL59cRqWBkQ12ZiGVW2DBL',
};

const ISSUER = 'bhere-sso';

module.exports = {
	keys,
	originAppName: ORIGIN_APP_NAME,
	allowedOrigin: ALLOWED_ORIGIN,
	tokens: TOKENS,
	issuer: ISSUER,
};
