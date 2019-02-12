const Vue = require('vue');
const App = require('./components/App.vue');

const Vuetify = require('vuetify');

Vue.use(Vuetify);

new Vue({
	el: '#app',
	components: {
		App
	},
	render: createElement => createElement('app')
});
