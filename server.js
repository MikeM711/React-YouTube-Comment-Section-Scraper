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

app.get('/api/hello', (req,res) => {
  res.send({ express: 'Hello From Express' })
})

// POST method route example
app.post('/api/world', (req, res) => {
  console.log(req.body.post);
  res.write('1. hello world ')
  setTimeout(() => {
    res.write(
      `2. I received your POST request. This is what you sent me: ${req.body.post}`,
    );
  },3000)

  setTimeout(() => {
    res.end();
  },8000)
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if(!err){
    console.log('site is live')
  }
  else {
    console.log(err)
  }
})