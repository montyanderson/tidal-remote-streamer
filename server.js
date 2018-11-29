const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const axios = require('axios');
const { spawn } = require('child_process');

const Tidal = require('./lib/Tidal');

const app = new Koa();
const router = new Router();

const tidal = new Tidal();

router.get('/api/search', async ctx => {
	ctx.body = await tidal.search(ctx.query.query);
});

let streamer, player;

router.get('/api/play', async ctx => {
	const url = await tidal.getTrackUrl(ctx.query.id);

	if(player) {
		streamer.destroy();
		player.kill('SIGSTOP');
	}

	player = spawn('play', [
		'-'
	]);

	await new Promise(resolve => setTimeout(resolve, 1000));

	const { data } = await axios.get(url, {
		responseType: 'stream'
	});

	streamer = data;

	streamer.pipe(player.stdin);

	player.stdout.on('data', data => console.log('stdout', data.toString()));
	player.stderr.on('data', data => console.log('stderr', data.toString()));
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(serve(`${__dirname}/public`));

(async ctx => {
	const config = require('./.config.json');

	await tidal.login(config.username, config.password);

	app.listen(config.port);
})();
