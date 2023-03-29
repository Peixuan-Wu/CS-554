const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const helpers = require('../helpers');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const createUser = async (name, username, password) => {
  // check input
  await helpers.checkIsProperString(name);
  await helpers.checkIsProperString(username,"username")
  await helpers.checkIsLetterOrNum(username,"password")

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

  // check if there is duplicate
  const userCollection = await users();

  const returnUser = await userCollection.findOne({username: username});
  if (returnUser){
    //duplicate exists
    throw "Username: Already a user with that username"
  }

  // hash password
  const hash = await bcrypt.hash(password, saltRounds);

  let newUser = {
    name: name,
    username: username,
    password: hash
  }

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add user';

  return insertInfo.insertedId.toString();


}

const checkUser = async(username, password) => {
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

  const userCollection = await users();

  const returnUser = await userCollection.findOne({username: username});

  if (!returnUser){
    //User does not exists
    throw "Either the username or password is invalid"
  }

  let correctPassword = false;

  try {
    correctPassword = await bcrypt.compare(password, returnUser.password);
  } catch (e) {
    //no op
    throw "bcrypt compare failed"
  }

  if  (correctPassword) {
    return returnUser;
  }else{
    throw "Either the username or password is invalid"
  }

}

module.exports = {
  createUser,
  checkUser
};
