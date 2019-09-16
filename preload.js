// const {remote, ipcRenderer} = require('electron')
// const fs = require('fs')
// const path = require('path')
// const utils = require('./utils')
const ctdlgpt = require('./ctdlgpt.js')

// functions for saving and loading thoughts to a file in a directory returned by utils.get_userdir()
//
// window.load_thoughts = function(callback) {
// 	let thoughtfile = path.join(utils.get_userdir(), 'inbox.json')
//
// 	fs.readFile(thoughtfile, 'utf8', (err, data) => {
//
// 		if (err) {
// 			switch(err.code) {
// 				case 'ENOENT':
// 					callback([])
// 					break
// 				default:
// 					throw err
// 			}
// 			return
// 		}
//
// 		callback(JSON.parse(data))
//
// 	})
// }
//
//
// window.save_thoughts = function(thoughtlist) {
// 	let thoughtfile = path.join(utils.get_userdir(), 'inbox.json')
//
// 	fs.writeFile(thoughtfile, JSON.stringify(thoughtlist), (err) => {
// 		if (err) {
// 			console.log(err)
// 		}
// 	})
// }

window.CTDLGPT = new ctdlgpt.CTDLGPT();
