require! {
}

/*============================================================================
*
*   Action types   
*
*============================================================================*/

CREATE = "CREATE_COOKBOOK"
READ = "READ_COOKBOOK"
UPDATE = "UPDATE_COOKBOOK"
DELETE = "DELETE_COOKBOOK"
SELECT = "SELECT_COOKBOOK"
EDITING = "EDITING_COOKBOOK"

editing-cookbook = (id) ->
  return {
    type: EDITING
    editing-cookbook: id 
  }

module.exports = {
  CREATE
  READ
  UPDATE
  DELETE
}
