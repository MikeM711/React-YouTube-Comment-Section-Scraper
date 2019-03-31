const express = require('express');
const exphbrs = require('express-handlebars')
const routes = require('./server/routes')
const bodyParser = require('body-parser');

const app = express();

// body parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// routes
app.use('/',routes)

// Handlebars
app.set('views','./server/views')
app.engine('.hbs',exphbrs({
  extname: '.hbs'
}))
app.set('view engine', '.hbs');

app.get('/', (req,res) => {
  res.send('Hello this is my YouTube Scraper app!')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if(!err){
    console.log('site is live')
  }
  else {
    console.log(err)
  }
})