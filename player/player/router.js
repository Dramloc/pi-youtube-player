const express = require('express');
const winston = require('winston');
const Player = require('./player');

const logger = winston.loggers.get('player');
const player = new Player();
let currentTrackIndex;
const tracks = [];

// FIXME: make me less stateful
function nextTrack() {
  if (undefined === currentTrackIndex) {
    currentTrackIndex = 0;
  } else {
    currentTrackIndex += 1;
  }
  if (currentTrackIndex >= tracks.length) {
    currentTrackIndex = 0;
  }
  if (tracks.length === 0) {
    return undefined;
  }
  return tracks[currentTrackIndex];
}

function addTrack(req, res) {
  // FIXME: validate track
  tracks.push(req.body);
  res.sendStatus(201);
}

function getTracks(req, res) {
  return res.json(tracks);
}

function play(res) {
  if (player.paused) {
    logger.debug('Resuming');
    player.resume();
    return res.sendStatus(204);
  }
  const track = nextTrack();
  if (undefined === track) {
    return res.status(400).json({
      error: 'No track has been added to the player',
    });
  }
  logger.debug(`Playing track ${track.id}`);
  player.play(`http://192.168.0.40:17000/api/v1/youtube/videos/${track.id}`);
  return res.sendStatus(204);
}

function pause(res) {
  logger.debug('Pausing');
  player.pause();
  return res.sendStatus(204);
}

function getPlayer(req, res) {
  return res.json({
    playing: player.playing,
    paused: player.paused,
  });
}

function updatePlayer(req, res) {
  const paused = req.body.paused;
  if (paused) {
    return pause(res);
  }
  return play(res);
}

const router = new express.Router();

router.get('/', getPlayer);
router.put('/', updatePlayer);
router.get('/tracks', getTracks);
router.post('/tracks', addTrack);

module.exports = router;
