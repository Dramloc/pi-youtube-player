const spawn = require('child_process').spawn;
const events = require('events');

class Player extends events.EventEmitter {

  constructor() {
    super();
    this.process = undefined;
  }

  play(uri) {
    this.process = spawn('vlc', ['--play-and-exit', uri]);
    this.process.on('exit', (code, sig) => {
      this.process = undefined;
      if (code !== null && sig !== null) {
        return this.emit('complete');
      }
      return this.emit('error', {
        code,
        sig,
      });
    });
  }

  pause() {
    if (undefined === this.process) {
      return;
    }
    this.process.kill('SIGSTOP');
    this.emit('pause');
  }

  resume() {
    if (undefined === this.process) {
      return;
    }
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

const player = new Player();
player.play('http://192.168.0.7:3000/api/v1/youtube/videos/OFqeoXFSlms');
setTimeout(() => {
  player.pause();
}, 2000);

setTimeout(() => {
  player.resume();
}, 5000);

setTimeout(() => {
  player.stop();
}, 10000);
