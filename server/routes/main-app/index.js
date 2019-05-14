const express = require('express');
const youtubeScraper = require('../../utils');

const router = express.Router();

router.post('/youtubeData', (req, res) => {
  (async function oneVideo(req, res) {
    const youtubeLink = req.body.url;
    const io = req.app.get('socketio');

    // Sending data to "scrape-video" util
    const data = await youtubeScraper.oneVideo(req, res, youtubeLink, io);
    // console.log(data)

    // send payload to frontend when complete
    io.emit('ResultData', data);
    res.end();
  })(req, res);
});

module.exports = router;