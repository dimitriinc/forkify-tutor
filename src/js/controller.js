import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'

import { MODAL_CLOSE_SEC } from './config.js'

import 'core-js/stable' // polyfilling
import 'regenerator-runtime/runtime' // polyfilling async/await


async function controlRecipes() {

  try {
    const recipeId = window.location.hash.slice(1)
    if (!recipeId) return

    recipeView.renderSpinner()

    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)

    await model.loadRecipe(recipeId)
    recipeView.render(model.state.recipe)

  } catch(error) {  
    recipeView.renderError()
    console.log(error);
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner()
    model.resetPagination()

    const query = searchView.getQuery()
    if (!query) return

    await model.loadSearchResults(query)

    resultsView.render(model.getSearchResultsPage())

    paginationView.render(model.state.search)
  } catch (error) {
    console.log(error);
  }
}

function controlPagination(goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

function controlServings(newServings) {
  // update state
  model.updateServings(newServings)

  // update UI
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

function controlAddBookmarks() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  recipeView.update(model.state.recipe)
  bookmarksView.render(model.state.bookmarks)
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks)
}

async function controlAddRecipe(newRecipe) {
  try {
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)

    recipeView.render(model.state.recipe)

    addRecipeView.renderMessage()

    bookmarksView.render(model.state.bookmarks)

    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    setTimeout(function() {
      addRecipeView._toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch(err) {
    addRecipeView.renderError(err.message)
  }
}


const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmarks)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
