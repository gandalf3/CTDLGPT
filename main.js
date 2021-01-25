const electron = require('electron')
// const { Thought, ThoughtCanvas } = require('./thought_canvas')
const url = require('url')
const path = require('path')

const{app, Menu} = electron;

function createWindow() {
	let win = new electron.BrowserWindow({
		width: 800,
		height: 600,
		icon: path.join(app.getAppPath(), "themes/MƎTTINS/icon.png"),
		webPreferences: {
			preload: path.join(app.getAppPath(), 'preload.js')
		},
	})

	win.loadFile('index.html')
}


electron.app.on('ready', createWindow)

//Create a menu

const mainMenuTemplate = [
	{
	label:'File',
	submenu:[
		{
			label:'Shopping List'
		},
		{
			label:'Doable actions & actionable do`s'
		},
		{
			label:'Active Quest Chains'
		},
		{
			label:'Habits'
		},
		{
			label:'DO IT NOW!'
		},
		{
			label:'Complex Tasks'
		},
		{
			label:'You did something!'
		},
		{
			label:'Quit',
			accelerator: process.platform == 'darwin' ? 'Command+Q' : 
			'Ctrl+Q',
			click(){
				app.quit();
				
			}
		},
	]
	}];
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

	// Menu.setApplicationMenu(mainMenu);
	
