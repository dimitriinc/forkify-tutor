import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'

import 'core-js/stable' // polyfilling
import 'regenerator-runtime/runtime' // polyfilling async/await

if (module.hot) {
  module.hot.accept()
}

async function controlRecipes() {

  try {
    const recipeId = window.location.hash.slice(1)
    if (!recipeId) return

    recipeView.renderSpinner()

    await model.loadRecipe(recipeId)
    recipeView.render(model.state.recipe)

  } catch(error) {  
    recipeView.renderError()
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpinner()

    const query = searchView.getQuery()
    if (!query) return

    await model.loadSearchResults(query)

    resultsView.render(model.getSearchResultsPage())
  } catch (error) {
    console.log(error);
  }
}

const init = function() {
  recipeView.addHandlerRender(controlRecipes)
  searchView.addHandlerSearch(controlSearchResults)
}

init()
