const express = require('express');
const youtubeScraper = require('../../utils')

const router = express.Router();

router.post('/youtubeData', (req, res) => {

  // IFFE async function
  (async function oneVideo(req,res) {
    const youtubeLink = req.body.url
    const io = req.app.get('socketio');

    // Sending data to "scrape-video" util
    const data = await youtubeScraper.oneVideo(req,res,youtubeLink,io)
    console.log(data)
    
    io.emit('ResultData', data);

    res.end()
  })(req,res)

})

//router.get('/homepage', (req, res) => {
//  res.render('home');
// });

module.exports = router;