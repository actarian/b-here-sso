const fs = require('fs');
const path = require('path');
const SSO_PRIVATE_KEY = process.env.SSO_PRIVATE_KEY || path.resolve(__dirname, './sso.key');
const ssoPrivateKey = fs.readFileSync(SSO_PRIVATE_KEY);

const config = {
	sso: {
		issuer: 'bhere-sso',
		apps: [{
			name: 'bhere-sso-consumer',
			// app token to validate the request is coming from the authenticated server only.
			bearer: 'l1Q7zkOL59cRqWBkQ12ZiGVW2DBL',
			origin: 'http://localhost:3020',
		}],
		privateKey: ssoPrivateKey,
	}
};

module.exports = config;
