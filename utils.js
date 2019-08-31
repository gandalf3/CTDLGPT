const path = require('path');
const fs = require('fs');
const app = require('electron').app;

// we have a function for this so it's easy to change
// this is a "computer friendly" version of the name which doesn't contain spaces which just makes path handling easier
function get_appname() {
	// cool to-do list game program thing
	return "ctdlgpt"
}

// return a dictionary of the "themes" (stylesheets/css files) in the themes directory (located in the app's sourcecode directory)
function get_themes() {
	let theme_path = path.join(app.getAppPath(), "themes");

	fs.readdir(theme_path, (err, files) => {
		console.log(files)
		// for (file of files)
	})

}

// return the appropriate app user data directory for the current platform. If it doesn't already exist, this function creates it.
function get_userdir() {
	// https://stackoverflow.com/a/26227660/2730823
	let userdir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : process.env.HOME + "/.local/share")
	// append our computer friendly name to the platform specific appdir/config path
	// e.g. C:\Users\MƎTTINS\AppData becomes C:\Users\MƎTTINS\AppData\ctdlgpt
	let appdir = path.join(userdir, get_appname())

	// always try to create that directory, handle errors as they occur
	fs.mkdir(appdir, (err) => {
		switch (err.code) {
			//if the directory already exists (EEXIST), that's fine, so don't throw it as an error
			case 'EEXIST': 
				break;
			//if anything else went wrong that's not fine, so yeah throw
			default:
				throw err;
		}
	});
	
	return appdir;
}

module.exports['get_userdir'] = get_userdir;
module.exports['get_appname'] = get_appname;
