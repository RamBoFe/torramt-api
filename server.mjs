import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import fs from 'fs';
import https from 'https';
import routes from './routes/index.mjs';
import config from './services/config.mjs';

const app = new Koa();
const PORT = 2223;

app.use(cors());
app.use(bodyParser());
app.use(routes);

if (config.get('node:protocol') === 'https') {
  const credentials = {
    key: config.get('node:https:key')
      ? fs.readFileSync(config.get('node:https:key'), 'utf8')
      : undefined,
    cert: config.get('node:https:cert')
      ? fs.readFileSync(config.get('node:https:cert'), 'utf8')
      : undefined,
    ca: config.get('node:https:ca')
      ? fs.readFileSync(config.get('node:https:ca'), 'utf8')
      : undefined,
  };

  https.createServer(credentials, app.callback()).listen(PORT);
} else {
  app.listen(PORT);
}

console.log(`Api Torrant listening on ${config.get('node:protocol')}://${config.get('node:domain')}:${config.get('node:port')}`);
