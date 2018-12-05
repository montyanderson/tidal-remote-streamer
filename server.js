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

let player, streamer;

const queue = [];

function stop() {
	if(player) {
		player.kill('SIGSTOP');
		streamer.destroy();
	}
}

async function play(url) {
	stop();

	player = spawn('play', [ '-', '--bits', '16', '--rate', '44100' ]);

	player.on('exit', async () => {
		await next();
	});

	await new Promise(resolve => setTimeout(resolve, 500));

	streamer = (await axios.get(url, {
		responseType: 'stream'
	})).data;

	streamer.pipe(player.stdin);
}

async function next() {
	stop();

	if(queue.length > 0)
		await play(queue.shift());
}

router.get('/api/play', async ctx => {
	const url = await tidal.getTrackUrl(ctx.query.id);

	await play(url);

	ctx.body = JSON.stringify(queue);
});

router.get('/api/queue', async ctx => {
	const url = await tidal.getTrackUrl(ctx.query.id);

	console.log(player);

	if(!player) {
		play(url);
	} else {
		queue.push(url);
	}

	ctx.body = JSON.stringify(queue);
});

router.get('/api/next', async ctx => {
	await next();

	ctx.body = JSON.stringify(queue);
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
