require! {
    "nedb": nedb 
    "../utils/logger": logger
}

class CookbookMgr
    /* 
    {
        "name": "cookbook1",
        "description": "cookbook description",
        "content": {
        }
    }
    */

    (dbname, inMemoryOnly=false)->
      @db = new nedb {filename: dbname , autoload: true, inMemoryOnly: inMemoryOnly}

    list_cookbooks: (callback) ->
      return @db.find {}, (err, docs) ->
        callback err, docs

    update_cookbook: (data, callback) ->
      @db.update {_id: data._id}, data, {upsert: true}, (err, numReplaced) ->
        if err
          logger.error "Update cookbook %s failed", data.name, err, data 

        callback err, numReplaced

    read_cookbook: (id, callback) ->
      @db.findOne {_id: id}, (err, doc) ->
        if err
          logger.error "Read cookbook %s failed", name, err

        callback err, doc

    delete_cookbook: (id, callback) ->
      @db.remove {_id: id}, (err, numRemoved) ->
        if err
          logger.error "Delete cookbook %s failed", name, err

        callback err, numRemoved

module.exports = {
    CookbookMgr: CookbookMgr
}
