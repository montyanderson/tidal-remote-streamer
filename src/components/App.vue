<template>
	<div class="container">
		<h1>tidal-remote-streamer</h1>

		<input v-model="query" v-on:keyup="search" type="text" class="form-control" placeholder="Search">

		<div class="row container">
			<div v-for="result in results" class="col-12">
				<h4 v-on:click="play(result)">{{result.title}}</h4>
				<h5>
					<span v-for="artist in result.artists" class="label label-default">
						{{artist.name}}
					</span>
				</h5>
			</div>
		</div>
	</div>
</template>

<script>
const axios = require('axios');

module.exports = {
	data: () => ({
		query: '',
		results: []
	}),
	methods: {
		async search() {
			const { data } = await axios.get('/api/search', {
				params: {
					query: this.query
				}
			});

			this.results = data;
		},

		async play({ id }) {
			await axios.get('/api/play', {
				params: {
					id
				}
			});
		}
	}
};
</script>
