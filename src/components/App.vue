<template>
	<div class="container">
		<h1>tidal-remote-streamer</h1>

		<input v-model="query" v-on:keyup="search" type="text" class="form-control" placeholder="Search">

		<h1 v-on:click="next">Next</h1>

		<div class="row container">
			<div v-for="result in results" class="col-12">
				<h4><span v-on:click="play(result)">{{result.title}}</span> <a v-on:click="pushToQueue(result)">Queue</a></h4>
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
		results: [],
		queue: []
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
			const { data } = await axios.get('/api/play', {
				params: {
					id
				}
			});

			this.queue = data;
		},

		async pushToQueue({ id }) {
			const { data } = await axios.get('/api/queue', {
				params: {
					id
				}
			});

			this.queue = data;
		},

		async next() {
			const { data } = await axios.get('/api/next');

			this.queue = data;
		}
	}
};
</script>
