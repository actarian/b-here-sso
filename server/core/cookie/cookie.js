const { encode, decode } = require('../utils/utils');

function getCookie(req, key) {
	return decode(req.cookies[key]);
}

// maxAge defaults 30 days
function setCookie(req, res, key, value, maxAge = 30 * 24 * 3600 * 1000) {
	if (value) {
		res.cookie(key, encode(value), {
			httpOnly: true,
			secure: (req.protocol === 'https'), // cookie must be sent over https / ssl
			sameSite: 'lax', // 'strict' or 'lax' or 'none'
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

/*
to get a cookie from an incoming request ..
let cookie = req.cookies['cookiename'];
to set a response cookie (this cookie will be sent on all future incoming requests until deletion or expiration) ..
res.cookie('cookiename', 'cookievalue', {
	maxAge: 86400 * 1000, // 24 hours
	httpOnly: true, // http only, prevents JavaScript cookie access
	secure: (req.protocol === 'https') // cookie must be sent over https / ssl
});
to delete a response cookie ..
res.cookie('cookiename', 'cookievalue', {
	maxAge: 0
});
*/
