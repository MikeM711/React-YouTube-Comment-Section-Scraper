const express = require('express');
const youtubeScraper = require('../../utils')

const router = express.Router();

router.post('/youtubeData', (req, res) => {
  // page stays responsive for longer than 2 minutes
  // req.connection.setTimeout(30 * 1000);
  (async function oneVideo(req,res) {
    const youtubeLink = req.body.url
    const io = req.app.get('socketio');
    const data = await youtubeScraper.oneVideo(req,res,youtubeLink,io)
    console.log(data)
    // as long as we show the bottom line, React can get the data
    // res.write(data) - this will show up in the frontend
    io.emit('ResultData', data);

    res.end()

    // Render to Handlebars
    // res.render('home', {
    //   retrievedData: data,
    // })
  })(req,res)
})

router.get('/homepage', (req, res) => {
  res.render('home');
});

module.exports = router;