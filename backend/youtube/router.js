const express = require('express');
const winston = require('winston');
const ytdl = require('youtube-dl');
const config = require('../config');
const url = require('url');

const URL = url.URL;
const logger = winston.loggers.get('youtube');

function streamVideo(videoURL, res) {
  const stream = ytdl(videoURL);
  res.type('video/webm');
  stream.on('info', (info) => {
    logger.info(`"${info.title}" stream started`);
    stream.pipe(res);
  });

  stream.on('end', () => {
    logger.info('stream ended');
    res.end();
  });

  return stream;
}

function watch(req, res) {
  const id = req.params.id;
  const videoURL = new URL(config.youtube.urls.watch);
  videoURL.search = `v=${id}`;

  return streamVideo(url.format(videoURL), res);
}

const router = new express.Router();

router.get('/videos/:id', watch);

module.exports = router;
