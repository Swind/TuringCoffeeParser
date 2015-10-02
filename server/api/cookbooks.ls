require! {
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
      reply {
        statusCode: 200
        message: "List all cookbooks successfully"
        data: cookbooks
      }

update_cookbook = (request, reply) ->
  cbmgr.update request.payload, (err, upsert) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else
      reply {
        statusCode: 201
        message: "Update cookbook successfully"
        data: upsert
      }

read_cookbook = (request, reply) ->
  cbmgr.read request.params.id, (err, cookbook) ->
    if err
      reply {
        statusCode: 503
        message: err
      }
    else
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
    else
      reply {
        statusCode: 200
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
      description: "Create or update the cookbook"
      notes: "If the data which contains '_id' field is update otherwise create"
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
    }
    handler: delete_cookbook
  }
]
