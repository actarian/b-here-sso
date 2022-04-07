const fs = require('fs');
const path = require('path');

function readFileSync(keyPath) {
	const keyUrl = path.resolve(__dirname, keyPath);
	return fs.readFileSync(keyUrl);
}

// app secret to validate the request is coming from the authenticated server only.
const SSO_SECRED = process.env.SSO_SECRET || 'l1Q7zkOL59cRqWBkQ12ZiGVW2DBL';
const SSO_PRIVATE_KEY = process.env.SSO_PRIVATE_KEY || readFileSync('./sso.key');

const config = {
	sso: {
		issuer: 'bhere-sso',
		apps: [{
			secret: SSO_SECRED,
			name: 'bhere-sso-consumer',
			scope: 'id, email, firstName, lastName, role',
			origin: 'http://localhost:3020',
		}],
		privateKey: SSO_PRIVATE_KEY,
	}
};

module.exports = config;
