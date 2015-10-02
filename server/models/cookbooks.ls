require! {
    "nedb": nedb 
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

    list: (callback) ->
      return @db.find {}, (err, docs) ->
        callback err, docs

    update: (data, callback) ->
      @db.update {_id: data._id}, data, {upsert: true}, (err, numReplaced, upsert) ->
        callback err, upsert

    read: (id, callback) ->
      @db.findOne {_id: id}, (err, doc) ->
        callback err, doc

    delete: (id, callback) ->
      @db.remove {_id: id}, (err, numRemoved) ->
        callback err, numRemoved

module.exports = CookbookMgr
