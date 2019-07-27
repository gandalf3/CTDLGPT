const electron = require('electron')
// const { Thought, ThoughtCanvas } = require('./thought_canvas')
const url = require('url')
const path = require('path')

function createWindow() {
	let win = new electron.BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
	})

	win.loadFile('index.html')
}

electron.app.on('ready', createWindow)

