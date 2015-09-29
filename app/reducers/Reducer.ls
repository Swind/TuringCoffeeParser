require! {
  "redux": {combineReducers} 
  "../actions/CookbookActions": Actions
}

/*============================================================================
*
*   
*
*============================================================================*/

cookbooks = (state = [], action) ->
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

module.exports = TuringCoffeeStore
