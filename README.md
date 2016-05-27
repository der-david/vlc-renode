# vlc-renode
A node module to control the HTTP-interface of VLC.
## install
```
npm install --save vlc-renode
```

## sample usage
###### `index.js`
```javascript
"use strict";
const
  spawn = require('child_process').spawn,
  VLCRenode = require('vlc-renode');

var
  options = {
    password: 'secret', // defaults to 'admin'
    host: '127.0.0.1',  // defaults to 'localhost'
    port: 8080,         // defaults to 8080 anyways
    interval: 1000      // defaults to 500
  },
  process = spawn('vlc', ['-I', 'http', '--http-password', options.password, '--http-port', options.port], {
    stdio: 'ignore'
  }),
  vlc = new VLCRenode(options);

vlc.play('https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3').then(() => {
  setTimeout(() => {
    vlc.pause();
  }, 3000);
});

// nested changes are published in a flattened format: 'change:stats.readbytes'
vlc.on('change:volume', (oldVal, newVal) => {
  console.log(oldVal);
  console.log(newVal);
});
```
###### strict and ES6 harmony mode required
```
node index.js --use_strict --harmony
```

## TODO:
* ☑ events (for simple state changes)
* ☐ docs
* ☐ tests
