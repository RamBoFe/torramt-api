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

if (config.get('path_certificate')) {
  const credentials = {
    key: fs.readFileSync(`${config.get('path_certificate')}/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`${config.get('path_certificate')}/cert.pem`, 'utf8'),
    ca: fs.readFileSync(`${config.get('path_certificate')}/chain.pem`, 'utf8'),
  };

  https.createServer(credentials, app.callback()).listen(PORT);
} else {
  app.listen(PORT);
}

console.log('Api Torrant en écoute.');
