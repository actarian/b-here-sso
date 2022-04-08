// const { encode, decode } = require('../shared/utils');

const tokens = {};

const Token = {
	clean: () => {
		const now = Date.now();
		Object.keys(tokens).forEach(key => {
			if (tokens[key].expireAt < now) {
				delete tokens[key];
			}
		});
	},
	has: (id) => {
		Token.clean();
		return tokens[id] != null;
	},
	get: (id) => {
		Token.clean();
		return tokens[id];
		// return decode(tokens[id]);
	},
	set: (id, token) => {
		Token.clean();
		tokens[id] = token;
		// tokens[id] = encode(token);
	},
	delete: (id) => {
		delete tokens[id];
	},
};

module.exports = Token;
