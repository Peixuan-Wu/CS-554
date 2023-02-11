//here is where you'll set up your server as shown in lecture code.
const express = require('express');
const app = express();
const configRoutes = require('./routes');
let urlCount = {};

app.use(express.json());


const session = require('express-session');

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))

app.use('/', async(req, res, next) => {
  let body = JSON.parse(JSON.stringify(req.body));
  if (req.body.passwordInput) {
    body.passwordInput = "";
  }
  console.log(`request body = ${JSON.stringify(body)} Method = ${req.method} url = ${req.url}`)
  next();
})

app.use('/', async(req, res, next) => {
  if (req.url.toString() in urlCount) {
    urlCount[req.url] = urlCount[req.url] + 1;
  } else {
    urlCount[req.url] = 1;
  }
  console.log(urlCount[req.url]);
  next();
})

app.use('/recipes', async(req, res, next) => {
  if (req.method == 'POST' || req.method == "PATCH") {
    if (!req.session.user) {
      //not login
      return res.status(403).json({erroe: "please log in"});
    }
  }
  next();
})

app.use('/recipes/:id/comments', async(req, res, next) => {
  if (req.method == 'POST') {
    if (!req.session.user) {
      //not login
      return res.status(403).json({erroe: "please log in"});
    }
  }
  next();
})


app.use('/recipes/:recipeId/:commentId', async(req, res, next) => {
  if (req.method == 'DELETE') {
    if (!req.session.user) {
      //not login
      return res.status(403).json({erroe: "please log in"});
    }
  }
  next();
})

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

