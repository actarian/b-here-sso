
function toBase64(value) {
	return Buffer.from(value).toString('base64');
}

function fromBase64(value) {
	return Buffer.from(value, 'base64').toString();
}

function decode(value) {
	return value ? JSON.parse(fromBase64(value)) : null;
}

function encode(value) {
	return toBase64(JSON.stringify(value));
}

function getCookie(req, key) {
	return decode(req.cookies[key]);
}

// maxAge defaults 30 days
function setCookie(req, res, key, value, maxAge = 30 * 24 * 3600 * 1000) {
	if (value) {
		res.cookie(key, encode(value), {
			httpOnly: true,
			secure: (req.protocol === 'https'), // cookie must be sent over https / ssl
			sameSite: 'strict',
			maxAge: maxAge,
		});
	}
}

function deleteCookie(res, key) {
	res.cookie(key, '', {
		maxAge: 0
	});
}

const Cookie = {
	get: getCookie,
	set: setCookie,
	delete: deleteCookie,
};

module.exports = Cookie;
