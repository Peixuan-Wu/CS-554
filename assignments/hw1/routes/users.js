//require express and express router as shown in lecture code
const express = require('express');  
const router = express.Router();
const data = require('../data');
const userData = data.user;
const helpers = require('../helpers');
const {ObjectId} = require('mongodb');

router.route('/signup').post(async(req, res) => {
  let usernameInput = req.body.usernameInput
  let passwordInput = req.body.passwordInput
  let name = req.body.name
  try {
    // input check
    await helpers.checkIsProperString(name, "name")
    await helpers.checkIsProperString(usernameInput,"usernameInput")
    await helpers.checkIsLetterOrNum(usernameInput,"usernameInput")
    if (usernameInput.length < 3) {
      throw `Username should be at least 3 characters long`
    }

    await helpers.checkIsProperString(passwordInput,"passwordInput");
    if (passwordInput.length < 6) {
      throw  `Password should be at least 6 characters long`
    }
    if(!(new RegExp(String.raw`[A-Z]`)).test(passwordInput)){
      throw("Password: Needs to be atleast 1 uppercase letter ")
    }
    if(!(new RegExp(String.raw`[0-9]`)).test(passwordInput)){
      throw("Password: Needs to be atleast 1 digit ")
    }
    if(!(new RegExp(String.raw`[\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/\<\>\-\&\%\_\!]`)).test(passwordInput)){
      throw("Password: Needs to be atleast 1 special character ")
    }
    if(!(new RegExp(String.raw`[a-z]`)).test(passwordInput)) {
      throw("Password: Needs to be atleast 1 uppercase letter ")
    }

    let newUser = await userData.createUser(name, usernameInput, passwordInput);
    return res.json({
      "name": name,
      "username": usernameInput
    })

  } catch(e){
    return res.status(400).json({error: e})
  }
})

router.route('/login').post(async(req, res) => {
  let usernameInput = req.body.usernameInput
  let passwordInput = req.body.passwordInput
  if (req.session.user) {
    return res.status(400).json({error: "you have already logged in"})
  }
  // input check
  try {
    // input check
    await helpers.checkIsProperString(usernameInput,"usernameInput")
    await helpers.checkIsLetterOrNum(usernameInput,"usernameInput")
    if (usernameInput.length < 3) {
      throw `Username should be at least 3 characters long`
    }

    await helpers.checkIsProperString(passwordInput,"passwordInput");
    if (passwordInput.length < 6) {
      throw  `Password should be at least 6 characters long`
    }
    if(!(new RegExp(String.raw`[A-Z]`)).test(passwordInput)){
      throw("Password: Needs to be atleast 1 uppercase letter ")
    }
    if(!(new RegExp(String.raw`[0-9]`)).test(passwordInput)){
      throw("Password: Needs to be atleast 1 digit ")
    }
    if(!(new RegExp(String.raw`[\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/\<\>\-\&\%\_\!]`)).test(passwordInput)){
      throw("Password: Needs to be atleast 1 special character ")
    }
    if(!(new RegExp(String.raw`[a-z]`)).test(passwordInput)) {
      throw("Password: Needs to be atleast 1 lowercase letter ")
    }

    let returnUser = await userData.checkUser(usernameInput, passwordInput);
    if (!returnUser) {
      throw `Either your password or username is incorrect`;
    }
    if (returnUser) {
      req.session.user = {username: returnUser.username, _id: returnUser._id};
      return res.json({
      "name": returnUser.name,
      "username": returnUser.username})
    }
  } catch(e){
    return res.status(400).json({error: e})
  }
  
})

router.route('/logout').get(async(req, res) => {
  if (!req.session.user) {
    return res.status(400).json({error: "you have already logged out"})
  }
  req.session.destroy();
  return res.json({info: "Log out successfully"})
})



module.exports = router;