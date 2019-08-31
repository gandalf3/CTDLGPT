Vue.component('navbar', {
	data: () => { return { count: 0 } },
	template: "<div class='navbar'>Theme: <theme-switcher></theme-switcher></div>",
})

Vue.component('theme-switcher', {
	data: () => { 
		return {
			theme: null,
		}
	},
	template: "<select id='theme-picker'><option>Default</option></select>"
})

var vm = new Vue({el: '#ctdlgpt'})

