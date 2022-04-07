const config = require("../sso/sso.config");

const CACHE = {
	// A temporary cahce to store all the application that has login using the current session.
	// It can be useful for variuos audit purpose
	apps: {},
	users: {},
	// these token are for the validation purpose
	tokens: {},
};

function getAppName(origin) {
	const app = config.sso.apps.find(app => app.origin === origin);
	return app.name;
}

function setToken(origin, id, token) {
	CACHE.tokens[token] = [id, getAppName(origin)];
}

function hasToken(token) {
	return CACHE.tokens[token] != null;
}

function getUser(token) {
	return CACHE.users[token];
}

function setUser(key, value) {
	return CACHE.users[key] = value;
}

function getToken(token) {
	return CACHE.tokens[token] || null;
}

function deleteToken(token) {
	// delete the token from cache key for no futher use,
	delete CACHE.tokens[token];
}

function setApplication(origin, id) {
	if (CACHE.apps[id] == null) {
		CACHE.apps[id] = { [getAppName(origin)]: true };
	} else {
		CACHE.apps[id][getAppName(origin)] = true;
	}
}

function getApplication(id) {
	return CACHE.apps[id] || null;
}

function hasApplicationName(id, name) {
	const app = getApplication(id);
	return app && app[name];
}

function cacheApplication(origin, id, token) {
	setApplication(origin, id);
	setToken(origin, id, token);
	console.log(CACHE);
}

module.exports = {
	cache: CACHE,
	cacheApplication,
	getApplication,
	hasApplicationName,
	getUser,
	setUser,
	hasToken,
	getToken,
	setToken,
	deleteToken,
};
