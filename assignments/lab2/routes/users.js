//require express and express router as shown in lecture code
const express = require('express');  
const router = express.Router();
const data = require('../data');
const userData = data.user;
const helpers = require('../helpers');
const {ObjectId} = require('mongodb');
const redis = require('redis');
const client = redis.createClient();
client.connect().then(() => {});

router.route('/signup').post(async(req, res) => {
  let username = req.body.username
  let password = req.body.password
  let name = req.body.name
  try {
    // input check
    await helpers.checkIsProperString(name, "name")
    await helpers.checkIsProperString(username,"username")
    await helpers.checkIsLetterOrNum(username,"username")
    if (username.length < 3) {
      throw `Username should be at least 3 characters long`
    }

    await helpers.checkIsProperString(password,"password");
    if (password.length < 6) {
      throw  `Password should be at least 6 characters long`
    }
    if(!(new RegExp(String.raw`[A-Z]`)).test(password)){
      throw("Password: Needs to be atleast 1 uppercase letter ")
    }
    if(!(new RegExp(String.raw`[0-9]`)).test(password)){
      throw("Password: Needs to be atleast 1 digit ")
    }
    if(!(new RegExp(String.raw`[\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/\<\>\-\&\%\_\!]`)).test(password)){
      throw("Password: Needs to be atleast 1 special character ")
    }
    if(!(new RegExp(String.raw`[a-z]`)).test(password)) {
      throw("Password: Needs to be atleast 1 uppercase letter ")
    }

    let newUserId = await userData.createUser(name, username.toLowerCase(), password);
    return res.json({
      "_id": newUserId,
      "name": name,
      "username": username
    })

  } catch(e){
    return res.status(400).json({error: e})
  }
})

router.route('/login').post(async(req, res) => {
  let username = req.body.username
  let password = req.body.password
  if (req.session.user) {
    return res.status(400).json({error: "you have already logged in"})
  }
  // input check
  try {
    // input check
    await helpers.checkIsProperString(username,"username")
    await helpers.checkIsLetterOrNum(username,"username")
    if (username.length < 3) {
      throw `Username should be at least 3 characters long`
    }

    await helpers.checkIsProperString(password,"password");
    if (password.length < 6) {
      throw  `Password should be at least 6 characters long`
    }
    if(!(new RegExp(String.raw`[A-Z]`)).test(password)){
      throw("Password: Needs to be atleast 1 uppercase letter ")
    }
    if(!(new RegExp(String.raw`[0-9]`)).test(password)){
      throw("Password: Needs to be atleast 1 digit ")
    }
    if(!(new RegExp(String.raw`[\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/\<\>\-\&\%\_\!]`)).test(password)){
      throw("Password: Needs to be atleast 1 special character ")
    }
    if(!(new RegExp(String.raw`[a-z]`)).test(password)) {
      throw("Password: Needs to be atleast 1 lowercase letter ")
    }

    let returnUser = await userData.checkUser(username.toLowerCase(), password);
    if (!returnUser) {
      throw `Either the username or password is invalid`;
    }
    if (returnUser) {
      req.session.user = {username: returnUser.username, _id: returnUser._id};
      
      // store session in the redis
      await client.HSET("mysession", "username", returnUser.username);
      await client.HSET("mysession", "_id", returnUser._id.toString());
    }
    return res.json({ "_id": returnUser._id, "name": returnUser.name,"username": returnUser.username}) 
  } catch(e){
    if (e == `Either the username or password is invalid`) {
      return res.status(401).json({error:e});
    }
    return res.status(400).json({error: e});
  }
  
})

router.route('/logout').get(async(req, res) => {
  if (!req.session.user) {
    return res.status(400).json({error: "you have already logged out"})
  }
  req.session.destroy();
  client.DEL("mysession");
  return res.json({info: "Log out successfully"})
})

router.route('/mostaccessed').get(async(req, res) => {
  const recipes = await client.zRange('testSortList', 0, 9, {REV: true});

  // console.log(recipes);
  let result = recipes.map((element) => {
    return JSON.parse(element);
  });

  res.json(result);
})


module.exports = router;