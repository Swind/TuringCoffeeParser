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

selected-cookbook = (state = {}, action) ->
  console.log action.type
  console.log Actions.SELECT

  switch action.type
  case Actions.SELECT
    console.log action.cookbook
    return action.cookbook
  default
    return state

editor = (state = {}, action) ->
  return state

barista = (state = {}, action) ->
  return state

const TuringCoffeeStore = combineReducers {
  cookbooks
  selected-cookbook
  editor
  barista
}

module.exports = createStore TuringCoffeeStore
