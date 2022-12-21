const { readFileSync } = require('../core/utils/utils');

const SSO_PRIVATE_KEY = (process.env.SSO_PRIVATE_KEY || readFileSync(__dirname, './sso.key')).replace(/\\n/g, '\n');

const config = {
	sso: {
		issuer: 'bhere-sso',
		privateKey: SSO_PRIVATE_KEY,
	}
};

module.exports = config;
