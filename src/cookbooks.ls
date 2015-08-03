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

    (dbname)->
        db = new loki dbname 

        @cookbooks = db.getCollection \cookbooks
        if @cookbooks == null
            @cookbooks = db.addCollection \cookbooks, {indices: [\name]}
            db.saveDatabase!

    list_cookbooks:  !->
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

    read_cookbook: (id) ->
        cookbook = @cookbooks.get id
        return cookbook

    delete_cookbook: (id) ->
        cookbook = @cookbooks.get id
        @cookbooks.remove cookbook

module.exports = {
    CookbookMgr: CookbookMgr 
}


