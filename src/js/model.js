import {API_URL, RES_PER_PAGE} from './config'
import {getJson} from './helpers'

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: []
}

export const loadRecipe = async function(recipeId) {

    try {

        const data = await getJson(`${API_URL}${recipeId}`)        

        const { recipe } = data.data
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        }

        if (state.bookmarks.some(bookmark => bookmark.id === recipeId)) state.recipe.bookmarked = true
        else state.recipe.bookmark = false
        
    } catch (err) {
        throw err
    }

    
}

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query
        const data = await getJson(`${API_URL}?search=${query}`)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        })
    } catch (error) {
        throw error
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page

    const start = (page -1) * state.search.resultsPerPage
    const end = page * state.search.resultsPerPage

    return state.search.results.slice(start, end)
}

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings
    })
    state.recipe.servings = newServings
}

export const resetPagination = function() {
    state.search.page = 1
}

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
    state.bookmarks.push(recipe)
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true

    persistBookmarks()
}

export const deleteBookmark = function(id) {
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1)

    if (id === state.recipe.id) state.recipe.bookmarked = false

    persistBookmarks()
}

const initBookmarks = function() {
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage)
}

initBookmarks()
console.log(state.bookmarks);
