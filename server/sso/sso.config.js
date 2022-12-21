const { readFileSync } = require('../core/utils/utils');

const SSO_ISSUER = process.env.SSO_ISSUER || 'bhere-sso';
const SSO_PRIVATE_KEY = (process.env.SSO_PRIVATE_KEY || readFileSync(__dirname, './sso.key')).replace(/\\n/g, '\n');

const config = {
	sso: {
		issuer: SSO_ISSUER,
		privateKey: SSO_PRIVATE_KEY,
	}
};

module.exports = config;
