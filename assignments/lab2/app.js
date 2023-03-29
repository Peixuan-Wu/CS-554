//here is where you'll set up your server as shown in lecture code.
const express = require('express');
const {ObjectId} = require('mongodb');
const app = express();
const configRoutes = require('./routes');
const helpers = require('./helpers');
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});
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
  if (req.body.password) {
    body.password = "";
  }
  console.log(`request body = ${JSON.stringify(body)} Method = ${req.method} url = ${req.url}`)

  // check whether the session data stored in redis
  if (!session.user) {
    let exist = await client.HGETALL("mysession");
    if (Object.keys(exist).length != 0) {
      req.session.user = {username: await client.HGET("mysession", "username"), _id: await client.HGET("mysession", "_id")}
    }
  }
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
      return res.status(403).json({error: "please log in"});
    }
  }
  next();
})

app.use('/recipes/:id/comments', async(req, res, next) => {
  if (req.method == 'POST') {
    if (!req.session.user) {
      //not login
      return res.status(403).json({error: "please log in"});
    }
  }
  next();
})


app.use('/recipes/:recipeId/:commentId', async(req, res, next) => {
  if (req.method == 'DELETE') {
    if (!req.session.user) {
      //not login
      return res.status(403).json({error: "please log in"});
    }
  }
  next();
})


// redis middleware
app.use('/recipes', async (req, res, next) => {
  if (req.method == "GET" && req.originalUrl.split("?")[0] === '/recipes') {
    // check the query page is valid number
    let page = req.query.page;
    try {
      if (page) {
        await helpers.checkIsOnlyNum(page);
        page = parseInt(page);
      } else {
        req.query.page = "1";
        page = 1;
      }
      
    } catch(e) {
        return res.status(400).json({error:"provided page is not positive whole number"});
    }
    let exists = await client.exists('showRecipes' + page);
    if (exists) {
      //if we do have it in cache, send the raw html from cache
      console.log('Show List from cache');
      let showsRecipesPage = await client.get('showRecipes' + page);
      console.log('Sending HTML from Redis....');
      return res.json(JSON.parse(showsRecipesPage));
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use('/recipes/:id', async(req, res, next) => {
  if (req.method == 'GET' && req.params.id) {
    // check the id
    let id = req.params.id;
    try {
      await helpers.checkIsProperString(req.params.id, "recipeId");
      req.params.id = req.params.id.trim();
      if (!ObjectId.isValid(req.params.id)) {
        throw `request ID invalid object ID`;
      }
    } catch(e) {
      return res.status(400).json({error: e});
    }
    try {
      let exists = await client.exists(id);
      if (exists) {
        console.log('Show List from cache');
        let showRecipes = await client.get(id);
        await client.zIncrBy('testSortList', 1, showRecipes);
        console.log('Sending HTML from Redis....');
        return res.json(JSON.parse(showRecipes));
      } else {
        next();
      }
    } catch {
      return res.status(500).json({error:"Server Error"});
    }
  } else {
    next();
  }
})

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

