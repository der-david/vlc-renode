"use strict";
const
  EventEmitter = require('events'),
  request = require('request'),
  queryString = require('query-string'),
  flatJSON = require('flatjson');

module.exports = class VLCRenode extends EventEmitter {
  constructor(options) {
    super();
    if (typeof options !== 'object' || options === null) {
      options = {};
    }
    this._host = options.host || 'localhost';
    this._port = options.port || 8080;
    this._password = options.password || 'admin';
    this._options = {
      url: 'http://' + this._host + ':' + this._port + '/requests/status.json',
      auth: {
        username: '',
        password: this._password
      },
      json: true
    };
    this._state = {};
    this._stateFlat = {};
    this._intervalMilSecs = (options.interval !== undefined && Number.isInteger(options.interval) && options.interval > 100) ? options.interval : 500;
    this.connect();
  }
  _req(params) {
    var
      self = this,
      options = JSON.parse(JSON.stringify(this._options));
    if (typeof params === 'object' && options !== null) {
      options.url += '?' + queryString.stringify(params);
    }
    return new Promise((resolve, reject) => {
      request.get(options, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        var flatNew = flatJSON(body);
        if (self._state !== {}) {
          for (let attr in flatNew) {
            if (self._stateFlat[attr] != flatNew[attr]) {
              self.emit('change:' + attr, self._stateFlat[attr], flatNew[attr]);
            }
          }
        }
        self._state = body;
        self._stateFlat = flatNew;
        return resolve(body);
      });
    });
  }
  connect() {
    var self = this;
    this._interval = setInterval(() => {
      self._req()
    }, this._intervalMilSecs);
  }
  disconnect() {
    clearInterval(this._interval);
  }
  state(key) {
    var
      path = key.split('.'),
			cfg = this._state,
			result = null,
			l = path.length - 1,
			i = 0;
		for (let k of path) {
			if (typeof cfg === 'object' && cfg[k] !== undefined) {
				cfg = cfg[k];
				if (i === l) {
					result = cfg;
				}
			}
			i++;
		}
		return result;
  }
  isPlaying() {
    return this.state('state') === 'playing';
  }
  play(uri, noaudio, novideo) {
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
  resume(id) {
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
