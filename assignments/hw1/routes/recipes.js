//require express and express router as shown in lecture code
const {ObjectId} = require('mongodb');
const express = require('express');  
const router = express.Router();
const data = require('../data');
const recipeData = data.recipe;
const helpers = require('../helpers');


router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    let page = req.query.page;
    try {
      if (page) {
        await helpers.checkIsOnlyNum(page);
      }
    } catch(e) {
        return res.status(400).json({error:"provided page is not positive whole number"});
    }
    
    
    try {
      const recipeList = await recipeData.getRecipes(page);
      if (!recipeList || recipeList.length == 0) {
        throw `No recipe exist`
      }
      res.json(recipeList);  
    } catch (e) {
      if (e ==  "No recipe exist") {
        return res.status(404).json({error:"Not Found"});
      }
      return res.status(500).json({error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const recipePostData = req.body;

    // input check
    try {
      if (!recipePostData) {
        throw `you must provide request body`;
      } 
      // check and operate title
      await helpers.checkIsProperString(recipePostData.title, "recipePostData.title");
      recipePostData.title = recipePostData.title.trim(); // trim the title input

      // check ingredients
      if(!recipePostData.ingredients||!Array.isArray(recipePostData.ingredients)){
        throw `ingredients must be an array`;
      }
      if (recipePostData.ingredients.length < 3) {
        throw `ingredents should at least has three elements`
      }
      for (var i = 0; i < recipePostData.ingredients.length; i++) {
        await helpers.checkIsProperString(recipePostData.ingredients[i],`${recipePostData.ingredients[i]}`);
        if ((recipePostData.ingredients[i]).length > 50 || (recipePostData.ingredients[i]).length < 3) {
          throw `${recipePostData.ingredients[i]} should be 3 characters and the max 50 characters.`
        }
      }

      // check steps
      if(!recipePostData.steps||!Array.isArray(recipePostData.steps)){
        throw `steps must be an array`;
      }
      if(recipePostData.steps.length < 5){
        throw `steps must have at leat five elements`;
      }
      for(var i =0; i < recipePostData.steps.length; i++){
        await helpers.checkIsProperString(recipePostData.steps[i],"steps's element");
        if(recipePostData.steps[i].length < 20){
          throw `steps's element  must be at least 20 characters long`;
        }
      }

      // check cookingSkillRequired 
      await helpers.checkIsProperString(recipePostData.cookingSkillRequired, "recipePostData.cookingSkillRequired");
      if(recipePostData.cookingSkillRequired.toLowerCase() !="novice" && recipePostData.cookingSkillRequired!="intermediate" && recipePostData.cookingSkillRequired!="advanced") {
        throw `invalid cookingSkillRequired input`
      }
      
    } catch (e) {
      return res.status(400).json({error: e});
    }

    // create new recipe in the database
    try {
      const {title, ingredients, cookingSkillRequired, steps} = recipePostData;
      const newRecipe = await recipeData.createRecipe(title, ingredients, cookingSkillRequired, steps, req.session.user);
      res.json(newRecipe);
    } catch (e) {
      res.status(500).json({error: e});
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      await helpers.checkIsProperString(req.params.id, "recipeId");
      req.params.id = req.params.id.trim();
      if (!ObjectId.isValid(req.params.id)) {
        throw `request ID invalid object ID`;
      }
    } catch(e) {
      return res.status(400).json({error: e});
    }

    // get requested recipe from database
    try {
      const getRecipe = await recipeData.getRecipeById(req.params.id);
      res.json(getRecipe);
    } catch(e) {
      if (e == "Recipe Not Found") {
        return res.status(404).json({error: e});
      } else {
        return res.status(500).json({error: e});
      }
    }
     
  })
  .patch(async (req, res) => {
    let requestBody = req.body;
    let updatedObject = {}; 
    let id;
    // check the recipeId exist in database
    try {
      id = req.params.id;
      await helpers.checkIsProperString(id, 'Recipe ID');
      let returnRecipe = await recipeData.getRecipeById(id);
      if (returnRecipe.userThatPosted._id != req.session.user._id) {
        throw `You are not author of the recipe and cannot change the recipe`
      }
    } catch (e) {
      if (e == "You are not author of the recipe and cannot change the recipe") {
        return res.status(403).json({error: e})
      }
      return res.status(404).json({error: 'recipe not found'});
    }

    try {
      if (requestBody.title) {
        await helpers.checkIsProperString(requestBody.title, "requestBody.title");
        requestBody.title = requestBody.title.trim();
        updatedObject.title = requestBody.title;
      }
      if (requestBody.ingredients) {
        if(!requestBody.ingredients||!Array.isArray(requestBody.ingredients)){
          throw `ingredients must be an array`;
        }
        if (requestBody.ingredients.length < 3) {
          throw `ingredents should at least has three elements`
        }
        for (var i = 0; i < requestBody.ingredients.length; i++) {
          helpers.checkIsProperString(requestBody.ingredients[i],`${requestBody.ingredients[i]}`);
          if (requestBody.ingredients[i].length > 50 || requestBody.ingredients[i].length < 3) {
            throw `${requestBody.ingredients[i]} should be 3 characters and the max 50 characters.`
          }
        }
        updatedObject.ingredients = requestBody.ingredients;
      }
      if (requestBody.steps) {
        if(!requestBody.steps||!Array.isArray(requestBody.steps)){
          throw `steps must be an array`;
        }
        if(requestBody.steps.length < 5){
          throw `steps must have at leat five elements`;
        }
        for(var i =0; i < requestBody.steps.length; i++){
          await helpers.checkIsProperString(requestBody.steps[i],"steps's element");
          if(requestBody.steps[i].length < 20){
            throw `steps's element  must be at least 20 characters long`;
          }
        }
        updatedObject.steps = requestBody.steps;
      }
      if (requestBody.cookingSkillRequired) {
        await helpers.checkIsProperString(requestBody.cookingSkillRequired, "requestBody.cookingSkillRequired");
        if(requestBody.cookingSkillRequired.toLowerCase()!="novice" && requestBody.cookingSkillRequired.toLowerCase()!="intermediate" && requestBody.cookingSkillRequired.toLowerCase()!="advanced") {
          throw `invalid cookingSkillRequired input`
        }
        updatedObject.cookingSkillRequired = requestBody.cookingSkillRequired;
      }
    } catch (e) {
      return res.status(400).json({error: e});
    }

    if (Object.keys(updatedObject).length !== 0) {
      try {
        const updatedRecipe = await recipeData.updateRecipe(
          id,
          updatedObject
        );
        return res.json(updatedRecipe);
      } catch (e) {
        return res.status(500).json({error: e});
      }
    } else {
      return res.status(400).json({
        error:
          'No fields have been changed from their inital values, so no update has occurred'
      });
    }
    
  })

router.route('/:id/comments').post( async (req, res) => {
  const addCommentData = req.body;
  let id = req.params.id
  // check and operate id
  try {
    await helpers.checkIsProperString(id, "RecipeId");
    id = id.trim();
    if (!ObjectId.isValid(id)) throw `Error: request ID invalid object ID`;
  } catch(e) {
    return res.status(400).json({error: e});
  }

  // check the recipeId exist in database
  try {
    await recipeData.getRecipeById(id);
  } catch (e) {
    return res.status(404).json({error: 'Recipe Not Found'});
  }

  // input check
  // check and modify comment
  try {
    await helpers.checkIsProperString(addCommentData.comment, "addCommentData.comment");
    addCommentData.comment = addCommentData.comment.trim();
  } catch(e) {
    return res.status(400).json({error: e});
  }

  // post comment
  try {
    // add comment
    addCommentData.userThatPostedComment = {_id: req.session.user._id, username: req.session.user.username}
    const {comment, userThatPostedComment} = addCommentData;
    let returnRecipe = await recipeData.createComment(comment, userThatPostedComment, id);
    return res.json(returnRecipe);
  } catch(e) {
    return res.status(500).json({error: e});
  }

})

router.route('/:recipeId/:commentId').delete(async (req, res) => {
  // check and operate id

  try {
    await helpers.checkIsProperString(req.params.recipeId, "RecipeId");
    req.params.recipeId = req.params.recipeId.trim();
    if (!ObjectId.isValid(req.params.recipeId)) throw `Error: request ID invalid object ID`;
  } catch(e) {
    return res.status(400).json({error: e});
  }

  try {
    await helpers.checkIsProperString(req.params.commentId, "commentId");
    req.params.commentId = req.params.commentId.trim();
    if (!ObjectId.isValid(req.params.commentId)) throw `Error: request ID invalid object ID`;
  } catch(e) {
    return res.status(400).json({error: e});
  }


  // check the recipeId exist in database || comment exist in the recipe
  try {
    let returnRecipe = await recipeData.getRecipeById(req.params.recipeId);
    let hasComment = false;
    for (var i = 0; i < returnRecipe.comments.length; i++) {
      if (returnRecipe.comments[i]._id == req.params.commentId) {
        hasComment = true;
        // check is the same user
        if (returnRecipe.comments[i].userThatPostedComment._id != req.session.user._id) {
          throw `You are not the author of the comment and cannot delete the comment`
        }
      }
    }
    if (!hasComment) {
      throw `Comment Not Found`;
    }
  } catch (e) {
    if (e == "You are not the author of the comment and cannot delete the comment") {
      return res.status(403).json({error: e})
    }
    return res.status(404).json({error: e});
  }

  // delete the comment
  try {
    let recipeAfterDeleteComment = await recipeData.removeComment(req.params.recipeId, req.params.commentId);
    res.json(recipeAfterDeleteComment);
  } catch(e) {
    return res.status(500).json({error: e});
  }

})

router.route('/:id/likes').post(async(req, res) => {
  let isLike = false;
  // check and operate id
  let id = req.params.id;
  try {
    await helpers.checkIsProperString(id, "RecipeId");
    id = id.trim();
    if (!ObjectId.isValid(id)) throw `Error: request ID invalid object ID`;
  } catch(e) {
    return res.status(400).json({error: e});
  }

  // check the recipeId exist in database and set isLike to valid value
  try {
    let returnRecipe = await recipeData.getRecipeById(id);
    for (var i = 0; i < returnRecipe.likes.length; i++) {
      if (returnRecipe.likes[i] == req.session.user._id) {
        isLike = true;
      }
    }
  } catch (e) {
    return res.status(404).json({error: 'Recipe Not Found'});
  }

  // post likes
  try {

    let recipeAterLike = await recipeData.updateLikes(isLike, req.session.user, id);

    res.json(recipeAterLike);

  } catch(e) {
    return res.status(500).json({error: e});
  }
})




module.exports = router;