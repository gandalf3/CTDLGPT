const path = require('path');
const fs = require('fs');

function get_appname() {
	// cool to-do list game program thing
	return "ctdlgpt"
}

function get_userdir() {
	// https://stackoverflow.com/a/26227660/2730823
	let userdir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share")
	let appdir = path.join(userdir, get_appname())

	fs.mkdir(appdir, (err) => {
		switch (err.code) {
			case 'EEXIST':
				break;
			default:
				throw err;
		}
	});
	
	return appdir;
}

module.exports['get_userdir'] = get_userdir;
module.exports['get_appname'] = get_appname;
