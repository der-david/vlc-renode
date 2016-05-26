# vlc-renode
A node module to control the HTTP-interface of VLC.

## sample usage
###### `yourapp.js`
```javascript
"use strict";
const
  spawn = require('child_process').spawn,
  VLCRenode = require('vlc-renode');

var
  options = {
    password: 'secret',
    host: '127.0.0.1',
    port: 6000
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
```
###### strict and ES6 harmony mode required
```
node yourapp.js --use_strict --harmony
````

## TODO:
* events
* docs
* tests
