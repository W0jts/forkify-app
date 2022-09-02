import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { TIMEOUT_ADD_RECIPE } from './config.js';
import * as model from './model.js';

import 'core-js/stable'; //Polyfilling everything else
import 'regenerator-runtime/runtime'; //Polyfilling async/await
import { async } from 'regenerator-runtime';
import { TIMEOUT_ADD_RECIPE } from './config.js';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err.message);
  }
};

const controlSearchResults = async function (query) {
  try {
    resultsView.renderSpinner();
    query = searchView.getQuery();
    await model.loadSearch(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlPagination = function (goToPage) {
  //Render new results and pagination buttons
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.addRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage(addRecipeView.message);
    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, TIMEOUT_ADD_RECIPE);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError();
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes); //Example of Publisher-Subscriber Pattern
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClicker(controlPagination);
  recipeView.addHandlerViev(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
