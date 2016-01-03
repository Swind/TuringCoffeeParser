UPDATE_EDITING_COOKBOOK = "UPDATE_EDITING_COOKBOOK"

updateEditingCookbook = (cookbook) ->
  type: UPDATE_EDITING_COOKBOOK
  cookbook: cookbook

module.exports = {
  UPDATE_EDITING_COOKBOOK
  updateEditingCookbook
}
