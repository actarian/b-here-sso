const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const Hashids = require('hashids');
const hashids = new Hashids();

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, '');
const createUUID = () => hashids.encodeHex(deHyphenatedUUID());

function readData(...components) {
	return new Promise((resolve, reject) => {
		const datapath = path.resolve(...components);
		fs.readFile(datapath, 'utf8', (error, data) => {
			if (error) {
				console.log('Data.readStore.error', error, datapath);
				reject(error);
			} else {
				try {
					const data = Object.assign(db, JSON.parse(data));
					resolve(data);
				} catch (error) {
					console.log('Data.readStore.error', error, datapath);
					reject(error);
				}
			}
		});
	});
}

function saveData(data, ...components) {
	return new Promise((resolve, reject) => {
		const datapath = path.resolve(...components);
		data = JSON.stringify(data, null, 2);
		fs.writeFile(datapath, data, 'utf8', (error, data) => {
			if (error) {
				console.log('Data.saveStore.error', error, datapath);
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

function readFileSync(...components) {
	const filePath = path.resolve(...components);
	return fs.readFileSync(filePath, 'utf8');
}

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

function findItemInCollection(values, collection) {
	const keys = Object.keys(values);
	const index = collection.reduce((p, c, i) => {
		const match = keys.reduce((m, key) => {
			return m && c[key] === values[key];
		}, true);
		return match ? i : p;
	}, -1);
	if (index !== -1) {
		return collection[index];
	} else {
		return null;
	}
}

module.exports = {
	readData,
	saveData,
	readFileSync,
	findItemInCollection,
	createUUID,
	encode,
	decode,
};
