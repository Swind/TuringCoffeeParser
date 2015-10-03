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
      @db.find {}, (err, docs) ->
        callback err, docs

    create: (data, callback) ->
      @db.insert data, (err, doc) ->
        callback err, doc

    update: (id, data, callback) ->
      @db.update {_id: id}, data, (err, numReplaced) ->
        callback err, numReplaced

    read: (id, callback) ->
      @db.findOne {_id: id}, (err, doc) ->
        callback err, doc

    delete: (id, callback) ->
      @db.remove {_id: id}, (err, numRemoved) ->
        callback err, numRemoved

module.exports = CookbookMgr
