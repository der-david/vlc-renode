const request = require('request');
const queryString = require('query-string');

module.exports = class VLCRenode {
  constructor(options) {
    if (typeof options !== 'object' || options === null) {
      options = {};
    }
    this._host = options.host || 'localhost';
    this._port = options.port || 8080;
    this._username = options.username || '';
    this._password = options.password || 'admin';
    this._options = {
      url: 'http://' + this._host + ':' + this._port + '/requests/status.json',
      auth: {
        username: this._username,
        password: this._password
      },
      headers: {
          'Content-Type': 'application/json'
      },
      json: true
    };
  }
  _req(params) {
    var options = this._options;
    if (typeof params === 'object' && options !== null) {
      options.url += queryString.stringify(params);
    }
    return new Promise((resolve, reject) => {
      request.get(options, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        return resolve(body);
      });
    });
  }
  start(uri, noaudio, novideo) {
    var params = {
      command: 'in_play',
      input: uri
    };
    if (noaudio)
      params.option = 'noaudio';
    else if (novideo)
      params.option = 'novideo';

    return this._req(params);
  }
  enqueue(uri) {
    return this._req({
      command: 'in_enqueue',
      input: uri
    });
  }
  play(id) {
    var params = {
      command: 'pl_play'
    };
    if (id)
      params.id = id;

    return this._req(params);
  }
  pause(id) {
    var params = {
      command: 'pl_pause'
    };
    if (id)
      params.id = id;

    return this._req(params);
  }
  forceResume() {
    return this._req({
      command: 'pl_forceresume'
    });
  }
  forcePause() {
    return this._req({
      command: 'pl_forcepause'
    });
  }
  stop() {
    return this._req({
      command: 'pl_stop'
    });
  }
  next() {
    return this._req({
      command: 'pl_next'
    });
  }
  previous() {
    return this._req({
      command: 'pl_previous'
    });
  }
  delete(id) {
    return this._req({
      command: 'pl_delete',
      id: id
    });
  }
  empty() {
    return this._req({
      command: 'pl_empty'
    });
  }
  rate(rate) {
    return this._req({
      command: 'rate',
      val: rate
    });
  }
  aspectRatio(aspectRatio) {
    return this._req({
      command: 'aspectratio',
      val: aspectRatio
    });
  }
  sort(id, val) {
    return this._req({
      command: 'pl_sort',
      id: id,
      val: val
    });
  }
  random() {
    return this._req({
      command: 'pl_random'
    });
  }
  loop() {
    return this._req({
      command: 'pl_loop'
    });
  }
  repeat() {
    return this._req({
      command: 'pl_repeat'
    });
  }
  fullscreen() {
    return this._req({
      command: 'fullscreen'
    });
  }
  volume(volume) {
    return this._req({
      command: 'volume',
      val: volume
    });
  }
}
