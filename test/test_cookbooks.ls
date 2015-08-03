require! {
    "../src/cookbooks.js": cbs
    "./testdata.js": testdata
    "assert": assert
}

test = it

<- describe 'Test Cookbooks Manager'
do
    <- describe 'Test CRUD'
    <- test 'Add two cookbooks and list all cookbooks, the result should be two'
    cbmgr = new cbs.CookbookMgr './test_cookbooks.json'
    cbmgr.cookbooks.removeDataOnly!

    # Create
    data = {
        name: "test1"
        description: "description content"
        content: testdata.spiral
    }
    cbmgr.update_cookbook(null, data)

    data = {
        name: "test2"
        description: "description content"
        content: testdata.circle
    }
    cbmgr.update_cookbook(null, data)

    result = cbmgr.list_cookbooks!
    assert.equal result.length, 2

    #Update
    # The last created cookbooks's id
    id = data.$loki
    data = {
        name: "test3"
        description: "description content"
        content: testdata.fixed_point
    }

    cbmgr.update_cookbook(id, data)
    new_data = cbmgr.read_cookbook(id)
    assert.equal new_data.name, data.name
    assert.equal new_data.content, data.content

    #Delete
    cbmgr.delete_cookbook(id)

    result = cbmgr.list_cookbooks!
    assert.equal result.length, 1

    for cookbook in result
        assert.notEqual cookbook.$loki, id

