require! {
  "redux": {combineReducers, createStore} 
  "../actions/CookbookActions": Actions
  "./testdata": Testdata
}

default_cookbooks = do ->

  map = {}
  for i from 1 to 10
    cookbook = Testdata.dummy_cb!
    cookbook.id = i
    map[i] = cookbook

  return map

/*============================================================================
*
*   
*
*============================================================================*/

cookbooks = (state = default_cookbooks, action) ->
  return state

editor = (state = {}, action) ->
  return state

barista = (state = {}, action) ->
  return state

const TuringCoffeeStore = combineReducers {
  cookbooks
  editor
  barista
}

module.exports = createStore TuringCoffeeStore
