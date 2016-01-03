require! {
  "redux": {combineReducers, createStore, compose, applyMiddleware} 
  "../actions/CookbookEditingActions": CookbookEditingActions
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
  switch action.type
  case CookbookEditingActions.UPDATE_EDITING_COOKBOOK
    return {
      cookbook: action.cookbook
    }

  default
    return state

barista = (state = {}, action) ->
  return state

const TuringCoffeeStore = combineReducers {
  cookbooks
  editor
  barista
}

module.exports = createStore TuringCoffeeStore
