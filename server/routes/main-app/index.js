const express = require('express');
const youtubeScraper = require('../../utils')

const router = express.Router();

router.post('/', (req, res) => {
  // page stays responsive for longer than 2 minutes
  // req.connection.setTimeout(30 * 1000);
  (async function oneVideo(req,res) {
    const youtubeLink = req.body.youtubeLink
    const data = await youtubeScraper.oneVideo(req,res,youtubeLink)
    console.log(data)
    // as long as we show the bottom line, React can get the data
    res.write(data)
    res.end()

    // Render to Handlebars
    // res.render('home', {
    //   retrievedData: data,
    // })
  })(req,res)
})

router.get('/', (req, res) => {
  res.render('home');
});

module.exports = router;