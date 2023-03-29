const { ObjectId } = require("mongodb");
const helpers = require('../helpers');
const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;



const createRecipe = async (title, ingredients, cookingSkillRequired, steps, user) => {
  // check title
  await helpers.checkIsProperString(title, "title");
  title = title.trim(); // trim the title input

  // check ingredients
  if(!ingredients||!Array.isArray(ingredients)){
    throw `ingredients must be an array`;
  }
  if (ingredients.length < 3) {
    throw `ingredents should at least has three elements`
  }
  for (var i = 0; i < ingredients.length; i++) {
    helpers.checkIsProperString(ingredients[i],`${ingredients[i]}`);
    if (ingredients[i].length > 50 || ingredients[i].length < 3) {
      throw `${ingredients[i]} should be 3 characters and the max 50 characters.`
    }
  }

  // check steps
  if(!steps||!Array.isArray(steps)){
    throw `steps must be an array`;
  }
  if(steps.length < 5){
    throw `steps must have at leat five elements`;
  }
  for(var i =0; i < steps.length; i++){
    await helpers.checkIsProperString(steps[i],"steps's element");
    if(steps[i].length < 20){
      throw `steps's element  must be at least 20 characters long`;
    }
  }

  // check cookingSkillRequired 
  await helpers.checkIsProperString(cookingSkillRequired, "cookingSkillRequired");
  cookingSkillRequired = cookingSkillRequired.toLowerCase();
  if(cookingSkillRequired!="novice" && cookingSkillRequired!="intermediate" && cookingSkillRequired!="advanced") {
    throw `invalid cookingSkillRequired input`
  }
  
  // create recipe object
  const recipeCollection = await recipes();

  let newRecipe = {
    title: title,
    ingredients: ingredients,
    cookingSkillRequired: cookingSkillRequired,
    steps: steps,
    userThatPosted: {_id: new ObjectId(user._id), username: user.username},
    comments: [],
    likes: []
  };

  // insert to database
 
  const newInsertInformation = await recipeCollection.insertOne(newRecipe);
  
  if (!newInsertInformation.insertedId) throw 'Error: Insert failed!';

  return await getRecipeById(newInsertInformation.insertedId.toString());
};

const getRecipes = async (page) => {
  let pages;
  if (page) {
    await helpers.checkIsProperString(page, "page");
    await helpers.checkIsOnlyNum(page, "page");
    if (parseInt(page) <= 0) {
      throw `page shoul not less than or equal to 0`
    }
    pages = parseInt(page);
  }

  const recipeCollection = await recipes();
  let result = [];
  if (!pages) {
    result = await recipeCollection.find({}).limit(50).toArray();
  } else {
    result = await recipeCollection.find({}).skip(50 * (pages - 1)).limit(50).toArray();
  }


  for (var i = 0; i < result.length; i++) {
    result[i]._id = result[i]._id.toString();
  }

  return result;
};

const getRecipeById = async (Id) => {

  // check Id
  await helpers.checkIsProperString(Id, "Id");
  Id = Id.trim();
  if (!ObjectId.isValid(Id)) throw 'invalid object ID';

  const recipeCollection = await recipes();
  const recipeObj = await recipeCollection.findOne({_id: new ObjectId(Id)});

  if (!recipeObj) {
    throw `Recipe Not Found`
  };
  
  recipeObj._id = recipeObj._id.toString();
  for (var i = 0; i < recipeObj.comments.length; i++) {
    recipeObj.comments[i]._id = recipeObj.comments[i]._id.toString();
  }

  recipeObj.userThatPosted._id = recipeObj.userThatPosted._id.toString();
  

  return recipeObj;

  // if not return throw(dead code)
  // throw 'No movie with that review';
};

const updateRecipe = async (id, updatedObject) => {
  const updatedRecipeData = {};
  // set variable to check whether update with identical object
  let isIdentical = true;

  // check the id
  await helpers.checkIsProperString(id, "Id");
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  // check the recipe exist 
  let returnRecipe = await getRecipeById(id);
  if (!returnRecipe) {
    throw `Recipe Not Found`;
  }
  
  if (updatedObject.title) {
    await helpers.checkIsProperString(updatedObject.title, "updatedObject.title");
    updatedRecipeData.title = updatedObject.title.trim();
    if (updatedObject.title != returnRecipe.title) {
      isIdentical = false;
    }
  }
  if (updatedObject.ingredients) {
    if(!updatedObject.ingredients||!Array.isArray(updatedObject.ingredients)){
      throw `ingredients must be an array`;
    }
    if (updatedObject.ingredients.length < 3) {
      throw `ingredents should at least has three elements`
    }
    if (updatedObject.ingredients.length != returnRecipe.ingredients.length) {
      isIdentical = false;
    }
    for (var i = 0; i < updatedObject.ingredients.length; i++) {
      await helpers.checkIsProperString(updatedObject.ingredients[i],`${updatedObject.ingredients[i]}`);
      if (updatedObject.ingredients[i].length > 50 || updatedObject.ingredients[i].length < 3) {
        throw `${updatedObject.ingredients[i]} should be 3 characters and the max 50 characters.`
      }
    }
    if (isIdentical) {
      for (var i = 0; i < returnRecipe.ingredients.length; i++) {
        if (updatedObject.ingredients[i] != returnRecipe.ingredients[i]) {
          isIdentical = false;
          break;
        }
      }
    }
    updatedRecipeData.ingredients = updatedObject.ingredients;

  }
  if (updatedObject.steps) {
    if(!updatedObject.steps||!Array.isArray(updatedObject.steps)){
      throw `steps must be an array`;
    }
    if(updatedObject.steps.length < 5){
      throw `steps must have at leat five elements`;
    }
    for(var i =0; i < updatedObject.steps.length; i++){
      await helpers.checkIsProperString(updatedObject.steps[i],"steps's element");
      if(updatedObject.steps[i].length < 20){
        throw `steps's element  must be at least 20 characters long`;
      }
    }
    updatedRecipeData.steps = updatedObject.steps;
    if (updatedObject.steps.length != returnRecipe.steps.length) {
      isIdentical = false;
    } else {
      for (var i = 0; i < returnRecipe.steps.length; i++) {
        if (updatedObject.steps[i] != returnRecipe.steps[i]) {
          isIdentical = false;
          break;
        }
      }
    }
  }
  if (updatedObject.cookingSkillRequired) {
    await helpers.checkIsProperString(updatedObject.cookingSkillRequired, "updatedObject.cookingSkillRequired");
    if(updatedObject.cookingSkillRequired.toLowerCase()!="novice" && updatedObject.cookingSkillRequired.toLowerCase()!="intermediate" && updatedObject.cookingSkillRequired.toLowerCase()!="advanced") {
      throw `invalid cookingSkillRequired input`
    }
    updatedRecipeData.cookingSkillRequired = updatedObject.cookingSkillRequired;
    if (updatedObject.cookingSkillRequired != returnRecipe.cookingSkillRequired) {
      isIdentical = false;
    }
  }

  if (isIdentical) {
    throw `You cannot update recipe with identical infomation`;
  }



  const recipeCollection = await recipes();
  await recipeCollection.updateOne(
    {_id: new ObjectId(id)},
    {$set: updatedRecipeData}
  );

  return await getRecipeById(id);
  
}

const createComment = async(comment, userThatPostedComment, id) => {
  // check input
  helpers.checkIsProperString(comment);
  helpers.checkIsProperString(id);
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  // check the recipe exist
  let returnRecipe = await getRecipeById(id);
  if (!returnRecipe) {
    throw `Recipe Not Found`;
  }

  // create recipe object

  const recipeCollection = await recipes(); 
  let commentId = new ObjectId();
  let newComment = {
    _id: commentId,
    userThatPostedComment: {
      _id: new ObjectId(userThatPostedComment._id), 
      username: userThatPostedComment.username, 
    },
    comment: comment
  }
  

  // insert to recipe
  const updatedInfo = await recipeCollection.updateOne(
    {_id: new ObjectId(id)},
    {$push: {
      comments:newComment
      }
    }
  )

  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update recipe comment successfully';
  }

  return await getRecipeById(id);

}

const removeComment = async(id, commentId) => {
  // check input 
  helpers.checkIsProperString(id);
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  helpers.checkIsProperString(commentId);
  if (!ObjectId.isValid(commentId)) throw 'invalid object ID';

  // check the comment exist
  let returnRecipe = await getRecipeById(id);
  let hasComment = false;
  for (var i = 0; i < returnRecipe.comments.length; i++) {
    if (returnRecipe.comments[i]._id == commentId) {
      hasComment = true;
    }
  }
  if (!hasComment) {
    throw `Comment Not Found`;
  }

  // delete the comment from this recipe
  const recipeCollection = await recipes(); 
  const updatedInfo = await recipeCollection.updateOne(
    {_id: new ObjectId(id)},
    {
      $pull: {comments:{ _id: new ObjectId(commentId)}}
    }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw 'could not remove comment successfully';
  }

  return await getRecipeById(id);

}

const updateLikes = async(isLike, user, id) => {

  if (typeof isLike != "boolean") {
    throw `isLike should be boolean`
  }
  await helpers.checkIsProperString(id)
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  // check the recipe exist
  let returnRecipe = await getRecipeById(id);
  if (!returnRecipe) {
    throw `Recipe Not Found`;
  }

  const recipeCollection = await recipes(); 
  if (isLike) {
    // delete from like list
    const updatedInfo = await recipeCollection.updateOne(
      {_id: new ObjectId(id)},
      {
        $pull: {likes: user._id}
      }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update like successfully';
    }
  } else {
    // add to like list
    const updatedInfo = await recipeCollection.updateOne(
      {_id: new ObjectId(id)},
      {
        $push: {likes: user._id}
      }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw 'could not update like successfully';
    }
  }
  
  return await getRecipeById(id.toString());
}

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  createComment,
  removeComment,
  updateLikes
}
