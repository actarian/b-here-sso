const express = require('express');
const morgan = require('morgan');
const app = express();
const engine = require('ejs-mate');
const session = require('express-session');
const ssoRouter = require('./sso/sso.router');
const fs = require('fs');
const https = require('https');
const Cache = require('./cache/cache');
const cookieParser = require('cookie-parser');
// const favicon = require('serve-favicon');
// const path = require('path');

function serve(options) {

	const PORT = 5000;
	const PORT_HTTPS = 9443;

	options = options || {};
	options.dirname = options.dirname || path.join(__dirname, '../');
	options.name = options.name || 'bhere-sso';
	options.baseHref = options.baseHref || `/${options.name}/`;
	options.port = process.env.PORT || options.port || PORT;
	options.portHttps = options.portHttps || PORT_HTTPS;
	console.log('serve', options);

	options.host = `http://localhost:${options.port}`;
	options.hostHttps = `https://localhost:${options.portHttps}`;

	app.use(session({
		secret: `${options.name}-secret-keyword`,
		saveUninitialized: true,
		resave: true
	}));
	app.use(cookieParser());
	app.disable('x-powered-by');
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(express.raw());
	// app.use(favicon(path.join(options.dirname, 'public', 'favicon.ico')))
	/*
	app.use((req, res, next) => {
	  console.log(req.session);
	  next();
	});
	*/

	app.use(morgan('dev'));

	app.engine('ejs', engine);

	app.set('views', options.dirname + '/views');
	app.set('view engine', 'ejs');

	app.use('/sso', ssoRouter);

	app.get('/', (req, res, next) => {
		const user = req.session.user || null;
		res.render('index', {
			title: 'BHere SSO - Index',
			user: user,
			cache: JSON.stringify(Cache.cache),
		});
	});

	// 404
	app.use((req, res, next) => {
		// catch 404 and forward to error handler
		const error = new Error(`Resource Not Found`);
		error.status = 404;
		next(error);
	});

	app.use((err, req, res, next) => {
		console.error({
			message: err.message,
			error: err,
		});
		const status = err.status || 500;
		let message = err.message || 'Internal Server Error';
		if (status === 500) {
			message = 'Internal Server Error';
		}
		res.status(status).json({ message });
	});

	app.listen(options.port, () => {
		console.info(`${options.name} running server at ${options.host}`);
	});

	const heroku = (process.env._ && process.env._.indexOf('heroku'));
	if (!heroku) {
		const privateKey = fs.readFileSync('cert.key', 'utf8');
		const certificate = fs.readFileSync('cert.crt', 'utf8');
		const credentials = { key: privateKey, cert: certificate };
		const serverHttps = https.createServer(credentials, app);
		serverHttps.listen(options.portHttps, () => {
			console.log(`${options.name} running server at ${options.hostHttps}`);
		});
	}

	return app;
}

module.exports = {
	serve,
};
