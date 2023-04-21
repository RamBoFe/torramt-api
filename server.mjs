import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import routes from './routes/index.mjs';
import config from './services/config.mjs';

const app = new Koa();

app.use(cors());
app.use(bodyParser());
app.use(routes);

app.listen(config.get('node:port'), () => {
  console.log(`Api Torrant listening on http://${config.get('node:domain')}:${config.get('node:port')}`);
});

