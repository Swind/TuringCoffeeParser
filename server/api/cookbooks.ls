require! {
  "joi": joi
  "../models/cookbooks": cookbooks
}

cbmgr = new cookbooks \cookbooks

list_cookbooks = (request, reply) ->
  cbmgr.list (err, cookbooks) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else
      # Remove the _id field and convert the list format 
      data = {}

      for cookbook in cookbooks
        data[cookbook._id] = cookbook
        delete cookbook._id 

      reply {
        statusCode: 200
        message: "List all cookbooks successfully"
        data: data 
      }

create_cookbook = (request, reply) ->
  cbmgr.create request.payload, (err, doc) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else
      reply {
        statusCode: 201
        message: "Create the cookbook successfully"
        data: doc
      }

update_cookbook = (request, reply) ->
  id = request.params.id
  cbmgr.update id, request.payload, (err, numReplaced) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else if numReplaced == 0
      reply {
        statusCode: 404
        message: "Can't find the cookbook with id #{id}"
      }
    else
      reply {
        statusCode: 204
        message: "Update cookbook successfully"
      }

read_cookbook = (request, reply) ->
  cbmgr.read request.params.id, (err, cookbook) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else if not cookbook
      reply {
        statusCode: 404
        message: "Can't find cookbook with id #{request.params.id}"
      }
    else
      delete cookbook._id
      reply {
        statusCode: 200
        message: "Read cookbook successfully"
        data: cookbook
      }

delete_cookbook = (request, reply) ->
  cbmgr.delete request.params.id, (err, numRemoved) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else if numRemoved == 0
      reply {
        statusCode: 404
        message: "Can't delete cookbook with id #{request.params.id}"
      }
    else
      reply {
        statusCode: 204
        message: "Delete cookbook successfully"
      }

module.exports = [
  {
    method: \GET
    path: '/api/cookbooks'
    config: {
      tags: [\api]
      description: "List all cookbooks"
      notes: "List all cookbooks"
    }
    handler: list_cookbooks
  }
  {
    method: \POST
    path: '/api/cookbooks'
    config: {
      tags: [\api]
      description: "Create a new cookbook"
      notes: "Create a new cookbook"
      validate: {
        payload: {
          name: joi.string!.required!
          description: joi.string!
          content: joi.object!
        }
      }
    }
    handler: create_cookbook
  }
  {
    method: \PUT
    path: '/api/cookbooks/{id}'
    config: {
      tags: [\api]
      description: "Update the cookbook"
      notes: "Update the cookbook"
      validate: {
        params: {
          id: joi.string!.required!
        }
        payload: {
          name: joi.string!.required!
          description: joi.string!
          content: joi.object!
        }
      }
    }
    handler: update_cookbook
  }
  {
    method: \GET
    path: '/api/cookbooks/{id}'
    config: {
      tags: [\api]
      description: "Read the cookbook"
      notes: "Read the cookbook"
      validate: {
        params: {
          id: joi.string!.required!
        }
      }
    }
    handler: read_cookbook
  }
  {
    method: \DELETE
    path: '/api/cookbooks/{id}'
    config: {
      tags: [\api]
      description: "Delete the cookbook"
      notes: "Delete the cookbook"
      validate: {
        params: {
          id: joi.string!.required!
        }
      }
    }
    handler: delete_cookbook
  }
]
