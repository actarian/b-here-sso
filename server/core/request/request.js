
// Note: express http converts all headers
// to lower case.
const AUTH_HEADER = 'authorization';
const BEARER_AUTH_SCHEME = 'bearer';

const headerRegEx = /(\S+)\s+(\S+)/;
function parseHeader(value) {
	if (typeof value !== 'string') {
		return null;
	}
	const matches = value.match(headerRegEx);
	return matches && { scheme: matches[1], value: matches[2] };
}

const getTokenFromHeaderWithScheme = function(scheme) {
	scheme = scheme.toLowerCase();
	return function(request) {
		let token = null;
		if (request.headers[AUTH_HEADER]) {
			const params = parseHeader(request.headers[AUTH_HEADER]);
			if (params && params.scheme.toLowerCase() === scheme) {
				token = params.value;
			}
		}
		return token;
	};
};

const getTokenFromHeaderAsBearer = function() {
	return getTokenFromHeaderWithScheme(BEARER_AUTH_SCHEME);
};

const getAuthorizationBearer = getTokenFromHeaderAsBearer();

module.exports = {
	getAuthorizationBearer,
};
