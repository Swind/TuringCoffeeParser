require! {
    "../server/cookbooks": cbs
    "./testdata": testdata
    "assert": assert
    "../utils/logger": logger
}

test = it

<- describe 'Test Cookbooks Manager'

<- describe 'Test Create, Read, Update and Delete'

done <- test 'Add two cookbooks and list all cookbooks, the result should be two'
var data

# In memory mode for testing
cbmgr = new cbs.CookbookMgr 'cookbooks.json', true

# Create
data := {
    name: "test1"
    description: "description content"
    content: testdata.spiral
}
err, numReplaced <- cbmgr.update_cookbook data

data := {
    name: "test2"
    description: "description content"
    content: testdata.circle
}
err, numReplaced <- cbmgr.update_cookbook data

err, docs <- cbmgr.list_cookbooks
assert.equal docs.length, 2

#Update
# The last created cookbooks's id
data.name = \test3
data.content = testdata.fixed_point

err, numReplaced <- cbmgr.update_cookbook data

err, doc <- cbmgr.read_cookbook data._id
assert.equal doc.name, data.name
assert.deepEqual doc.content, data.content

#Delete
<- cbmgr.delete_cookbook data._id

err, docs <- cbmgr.list_cookbooks
assert.equal docs.length, 1

for cookbook in docs
    assert.notEqual cookbook._id, data._id

done!

