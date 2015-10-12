require! {
  "redux": {combineReducers} 
  "../actions/CookbookActions": Actions
  "./testdata": Testdata
}

default_cookbooks = do ->
  list = [1 to 10].map ! -> return Testdata.dummy_cb!


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

module.exports = TuringCoffeeStore
