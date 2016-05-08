var TestData = require('./testdata');
var Assert = require('assert');
var Chai = require('chai');

var ApiServer = require('../src/api_server');
var CookbooksAPI = require('../src/api/cookbooks');
var CookbooksMgr = require('../src/models/cookbooks');

var logger = require('../utils/logger');
global.logger = logger;

Chai.should();

class TestAPI{
  constructor(api_server){
    this.server = api_server.server; 
  }

  get(url){
    return this.inject('GET', url);
  }

  put(url, data){
    return this.inject('PUT', url, data);
  }

  post(url, data){
    return this.inject('POST', url, data);
  }

  inject(method, url, data={}){
    let options = {
      method: method,
      url: url
    }

    if(data){
      options['payload'] = data;
    }

    return this.server.inject(options);
  }
}

function sleep(msec, val) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, msec, val);
    });
}

describe('GET:/cookbooks', ()=>{
  var api;

  before(async ()=>{
    api_server = new ApiServer('127.0.0.1', 3000);

    var cookbook_mgr = new CookbooksMgr();
    var cookbook_api = new CookbooksAPI(cookbook_mgr);

    api_server.route(cookbook_api.api_specs());
    api = new TestAPI(api_server);
  });

  describe('List and CRUD API of cookbooks', ()=>{
    it('Test GET:/cookbooks without any cookbook', async function(done){
      let data = {
        name: 'test1',
        description: 'description content',
        content: TestData.spiral
      };

      // List all cookbooks
      let result = await api.get('/api/cookbooks');

      // Now the cookbooks length should be 0
      json_result = JSON.parse(result.payload);
      json_result['data'].should.be.empty;

      result.statusCode.should.be.equal(200);

      done();
    });
  });

  describe('List and CRUD API of cookbooks', ()=>{
    it('Test POST:/cookbooks after add a cookbook', async function(done){
      try {
        let data = {
          name: 'test1',
          description: 'description content',
          content: TestData.spiral
        };

        // List all cookbooks
        let resp = await api.get('/api/cookbooks');

        // Now the cookbooks length should be 0
        json_result = JSON.parse(resp.payload);
        json_result['data'].should.be.empty;

        resp.result.statusCode.should.be.equal(200);

        resp = await api.post('/api/cookbooks', data);
        resp.result.statusCode.should.be.equal(201);
        json_result = JSON.parse(resp.payload);

        created_cookbook = json_result['data'];
        created_cookbook.should.be.not.empty;
        created_cookbook.name.should.be.equal(data.name);
        created_cookbook.description.should.be.equal(data.description);
        created_cookbook.content.should.be.eql(data.content);
        created_cookbook._id.should.be.not.empty;

        done();
      } catch(err){
        done(err);
      }
    });
  });

});
