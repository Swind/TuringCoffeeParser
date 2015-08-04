require! {
    "../src/app.js": app 
    "./testdata.js": testdata
    "chai": chai
    "assert": assert
    "supertest": supertest 
}

test = it

should = chai.should!
expect = chai.expect

<- describe '/cookbooks'

var server
var api

do
    <- before
    server := app 3000
    api := supertest server

do
    <- describe 'Test CRUD'
    done <- test '/cookbooks/new'

    data = {
        name: "test1"
        description: "description content"
        content: testdata.spiral
    }

    # Now the cookbooks length should be 0
    (err, res) <- api.get('/cookbooks').end
    res.body.length.should.equal 0

    # Create a new cookbook
    (err, res) <- api.put('/cookbooks/new')
                     .set("Accept", "application/json")
                     .send(data)
                     .end

    # Now the cookbooks length should be 1
    id = res.body['$loki']

    (err, res) <- api.get("/cookbooks").end
    expect(res.body.length).to.equal 1

    # Remove the cookbook
    (err, res) <- api.del "/cookbooks/#id"
                     .expect 204
                     .end

    (err, res) <- api.get("/cookbooks").end
    expect(res.body.length).to.equal 0 
    done!



