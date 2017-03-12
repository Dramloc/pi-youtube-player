const spawn = require('child_process').spawn;
const events = require('events');

class Player extends events.EventEmitter {

  constructor() {
    super();
    this.process = undefined;
    this.playing = false;
    this.paused = false;
  }

  play(uri) {
    this.process = spawn('vlc', ['--play-and-exit', uri]);
    this.playing = true;
    this.paused = false;
    this.process.on('close', (code) => {
      this.playing = false;
      this.paused = false;
      this.process = undefined;
      if (code === 0) {
        this.emit('complete');
      }
    });
  }

  pause() {
    if (undefined === this.process) {
      return;
    }
    this.paused = true;
    this.playing = false;
    this.process.kill('SIGSTOP');
    this.emit('pause');
  }

  resume() {
    if (undefined === this.process) {
      return;
    }
    this.paused = false;
    this.playing = true;
    this.process.kill('SIGCONT');
    this.emit('resume');
  }

  stop() {
    if (undefined === this.process) {
      return;
    }
    this.process.kill('SIGTERM');
    this.emit('stop');
  }
}

module.exports = Player;
