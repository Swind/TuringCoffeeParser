require! {
    "../src/app.js": app 
    "./testdata.js": testdata
    "chai": chai
    "assert": assert
    "supertest": supertest 
}

test = it

should = chai.should
expect = chai.expect

<- describe '/cookbooks'

var server
var api

do
    <- before
    server := app 3000
    api := supertest "http://localhost:3000"

do
    <- describe 'Test CRUD'
    done <- test 'Create a cookbook'

    data = {
        name: "test1"
        description: "description content"
        content: testdata.spiral
    }

    api.get '/cookbooks'
        .end (err, res) ->
            console.log err
            console.log res.body
            done!
