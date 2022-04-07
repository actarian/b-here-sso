const fs = require('fs');
const path = require('path');
const { createUUID } = require('../shared/utils');

const RoleType = {
	Publisher: 'publisher',
	Attendee: 'attendee',
	Streamer: 'streamer',
	Viewer: 'viewer',
	SmartDevice: 'smart-device',
	SelfService: 'self-service',
	Embed: 'embed',
};

let db = {
	views: [], menu: [], navmaps: [], paths: [], assets: [], users: [
		{
			id: '1601892639985',
			username: 'publisher',
			password: 'publisher',
			type: 'publisher',
			firstName: 'Jhon',
			lastName: 'Appleseed',
		}, {
			id: '1601892639986',
			username: 'attendee',
			password: 'attendee',
			type: 'attendee',
			firstName: 'Jhon',
			lastName: 'Appleseed',
		}
	]
};

let pathname;

function uuid() {
	// return new Date().getTime();
	return parseInt(process.hrtime.bigint().toString());
}

function useApi() {
	return null;
}

function readStore() {
	fs.readFile(pathname, 'utf8', (error, data) => {
		if (error) {
			console.log('NodeJs.Api.readStore.error', error, pathname);
		} else {
			try {
				db = Object.assign(db, JSON.parse(data));
			} catch (error) {
				console.log('NodeJs.Api.readStore.error', error, pathname);
			}
		}
	});
}

function saveStore() {
	const data = JSON.stringify(db, null, 2);
	fs.writeFile(pathname, data, 'utf8', (error, data) => {
		if (error) {
			console.log('NodeJs.Api.saveStore.error', error, pathname);
		}
	});
}

function sendError(response, status, message) {
	response.status(status).set('Content-Type', 'application/json').send(JSON.stringify({ status, message }));
}

function sendOk(response, data) {
	if (data) {
		response.status(200).set('Content-Type', 'application/json').send(JSON.stringify(data));
	} else {
		response.status(200).set('Content-Type', 'text/plain').send();
	}
}

function doCreate(request, response, params, items) {
	const body = request.body;
	const id = uuid();
	const item = Object.assign({}, body, { id });
	doSetLocale(item, params);
	items.push(item);
	saveStore();
	sendOk(response, item);
}

function doUpdate(request, response, params, items) {
	const body = request.body;
	const item = items.find(x => x.id === body.id);
	if (item) {
		Object.assign(item, body);
		doSetLocale(item, params);
		saveStore();
		sendOk(response, item);
	} else {
		sendError(response, 404, 'Not Found');
	}
}

function doDelete(request, response, params, items) {
	const index = items.reduce((p, x, i) => x.id === params.id ? i : p, -1);
	if (index !== -1) {
		// const item = items[index];
		items.splice(index, 1);
		saveStore();
		// sendOk(response, item);
		sendOk(response);
	} else {
		sendError(response, 404, 'Not Found');
	}
}

function doGet(request, response, params, items) {
	let item = items.find(x => x.id === params.id);
	if (!item) {
		sendError(response, 404, 'Not Found');
	}
	return item;
}

function doSetLocale(item, params) {
	const language = params.languageCode;
	if (language) {
		const localized = Object.assign({}, item);
		delete localized.locale;
		const locale = item.locale = (item.locale || {});
		locale[language] = localized;
		console.log('doSetLocale.languageCode', language);
	}
	return item;
}

const ROUTES = [{
	path: '/api/user/me', method: 'GET', callback: function(request, response, params) {
		const user = request.session.user;
		if (!user) {
			sendError(response, 404, 'Not Found');
		} else {
			sendOk(response, user);
		}
	}
}, {
	path: '/api/user/register', method: 'POST', callback: function(request, response, params) {
		const body = request.body;
		const user = db.users.find(x => x.username === body.username);
		if (user) {
			sendError(response, 409, 'Conflict');
		} else {
			doCreate(request, response, params, db.users);
			// request.session.user = user;
			// sendOk(response, user);
		}
	}
}, {
	path: '/api/user/login', method: 'POST', callback: function(request, response, params) {
		const body = request.body;
		const user = db.users.find(x => x.username === body.username && x.password === body.password);
		if (!user) {
			sendError(response, 404, 'Not Found');
		} else {
			request.session.user = body;
			sendOk(response, user);
		}
	}
}, {
	path: '/api/user/logout', method: 'GET', callback: function(request, response, params) {
		const user = request.session.user;
		request.session.user = null;
		sendOk(response);
	}
}];

ROUTES.forEach(route => {
	const segments = [];
	if (route.path === '**') {
		segments.push(route.path);
		route.matcher = new RegExp('^.*$');
	} else {
		const matchers = [`^`];
		const regExp = /(^\.\.\/|\.\/|\/\/|\/)|([^:|\/]+)\/?|\:([^\/]+)\/?/g;
		let relative;
		let match;
		while ((match = regExp.exec(route.path)) !== null) {
			const g1 = match[1];
			const g2 = match[2];
			const g3 = match[3];
			if (g1) {
				relative = !(g1 === '//' || g1 === '/');
			} else if (g2) {
				matchers.push(`\/(${g2})`);
				segments.push({ name: g2, param: null, value: null });
			} else if (g3) {
				matchers.push('\/([^\/]+)');
				const params = {};
				params[g3] = null;
				route.params = params;
				segments.push({ name: '', param: g3, value: null });
			}
		}
		matchers.push('$');
		const regexp = matchers.join('');
		console.log(regexp)
		route.matcher = new RegExp(regexp);
	}
	route.segments = segments;
});

function apiMiddleware(options) {
	if (!options.root) {
		throw new Error('missing Vars.root!');
	}
	if (!options.baseHref) {
		throw new Error('missing Vars.baseHref!');
	}

	pathname = path.join(options.dirname, `/docs/api/editor.json`);

	readStore();

	return (request, response, next) => {
		const url = request.baseUrl.replace(/\\/g, '/');
		const params = {};
		const method = ROUTES.find(route => {
			if (route.method.toLowerCase() === request.method.toLowerCase()) {
				const match = url.match(route.matcher);
				if (match) {
					route.segments.forEach((x, i) => {
						if (x.param) {
							let value = match[i + 1];
							if (parseInt(value).toString() === value) {
								value = parseInt(value);
							}
							params[x.param] = value;
						}
					});
					// console.log('match', match, route);
					return true;
				}
			}
		});
		if (method) {
			console.log('apiMiddleware.url', url, method.path, method.method, params);
			method.callback(request, response, params);
		} else {
			next();
		}
	};
};

function setSessionUser(request, userType) {
	userType = userType || RoleType.SelfService;
	const id = uuid();
	const user = {
		id,
		type: userType,
		username: userType,
		password: '****',
		firstName: 'Jhon',
		lastName: 'Appleseed',
	};
	request.session.user = user;
}

module.exports = {
	apiMiddleware,
	useApi,
	uuid,
	RoleType,
	setSessionUser,
};
