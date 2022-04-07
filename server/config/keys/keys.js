const fs = require('fs');
const path = require('path');

const SSO_PRIVATE_KEY = process.env.SSO_PRIVATE_KEY || path.resolve(__dirname, './sso.key');
const ssoPrivateKey = fs.readFileSync(SSO_PRIVATE_KEY);
const ssoValidityKey = 'simple-sso-validatity-key';

module.exports = {
	ssoPrivateKey,
	ssoValidityKey,
};
