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

select-cookbook = (cookbook) ->
  return {
    type: SELECT
    cookbook: cookbook 
  }

module.exports = {
  select-cookbook: select-cookbook
  CREATE
  READ
  UPDATE
  DELETE
  SELECT
}
