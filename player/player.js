const spawn = require('child_process').spawn;
const events = require('events');

class Player extends events.EventEmitter {

  constructor() {
    super();
    this.process = undefined;
  }

  play(uri) {
    this.process = spawn('vlc', ['--play-and-exit', uri]);
    this.process.on('close', (code) => {
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
console.log('Player created');
player.play('http://192.168.0.40:3000/api/v1/youtube/videos/OFqeoXFSlms');
player.on('complete', () => {
  process.exit(0);
});
player.on('stop', () => {
  process.exit(0);
})
console.log('Starting video');

setTimeout(() => {
  console.log('Pausing video');
  player.pause();
}, 15000);

setTimeout(() => {
  console.log('Resuming video');
  player.resume();
}, 20000);

setTimeout(() => {
  console.log('Stopping video');
  player.stop();
}, 25000);
