import nconf from 'nconf';

nconf.argv()
  .env({
    separator: '__',
    lowerCase: true,
  })
  .file({ file: 'config.json' });

export default nconf;
