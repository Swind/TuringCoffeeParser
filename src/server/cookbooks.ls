require! {
    "lokijs": loki
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

    (dbname, callback=null)->
        @db = new loki dbname 

        @db.loadDatabase {}, !~>
            @cookbooks = @db.getCollection \cookbooks

            if @cookbooks == null
                @cookbooks = @db.addCollection \cookbooks, {indices: [\name]}
                @db.saveDatabase!

            if callback != null
                callback!


    list_cookbooks: !->
        return @cookbooks.find!

    update_cookbook: (id, data) !->
        if id == null
            cookbook = @cookbooks.insert data
        else
            cookbook = @cookbooks.get id
            cookbook.name = data.name
            cookbook.description = data.description
            cookbook.content = data.content
            @cookbooks.update(cookbook)

        @db.saveDatabase!
        return cookbook

    read_cookbook: (id) ->
        cookbook = @cookbooks.get id
        return cookbook

    delete_cookbook: (id) ->
        @cookbooks.remove id
        @db.saveDatabase!

module.exports = {
    CookbookMgr: CookbookMgr 
}
