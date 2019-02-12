<template>
	<v-app>
		<v-content>

	<v-layout row>
		<v-flex xs12>
			<v-card>
				<v-toolbar color="cyan" dark>
					<v-toolbar-title>tidal-remote-streamer</v-toolbar-title>

					<v-spacer></v-spacer>
				</v-toolbar>

				<v-text-field
					v-model="query"
					@keyup="search"
	            ></v-text-field>

				<v-list three-line>
					<template v-for="(result, index) in results">
						<v-list-tile
							:key="result.id"
							avatar
							@click="play(result)"
						>
							<v-list-tile-avatar>
								<img :src="albumArt(result.album.cover)">
							</v-list-tile-avatar>

							<v-list-tile-content>
								<v-list-tile-title>{{result.title}}</v-list-tile-title>
								<!--<a v-on:click="pushToQueue(result)">Queue</a>-->
								<v-list-tile-sub-title>{{result.artists[0].name}}</v-list-tile-sub-title>
							</v-list-tile-content>

						</v-list-tile>
					</template>
				</v-list>
			</v-card>
		</v-flex>
	</v-layout>

</v-content>
</v-app>
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
		},

		albumArt(id) {
			return `https://resources.tidal.com/images/${id.replace(/-/g, '/')}/320x320.jpg`;
		}
	}
};
</script>
