const uuidv4 = require('uuid/v4');
const Hashids = require('hashids');
const hashids = new Hashids();

const deHyphenatedUUID = () => uuidv4().replace(/-/gi, '');
const createUUID = () => hashids.encodeHex(deHyphenatedUUID());

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
	findItemInCollection,
	createUUID,
};
