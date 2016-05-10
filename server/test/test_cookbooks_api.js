var TestData = require('./testdata');
var Assert = require('assert');
var Chai = require('chai');

var ApiServer = require('../src/api_server');
var CookbooksAPI = require('../src/api/cookbooks');
var CookbooksMgr = require('../src/models/cookbooks');

var logger = require('../libs/utils/logger');

Chai.should();

class TestAPI {
  constructor(api_server) {
    this.server = api_server.server;
  }

  get(url) {
    return this.inject('GET', url);
  }

  put(url, data) {
    return this.inject('PUT', url, data);
  }

  post(url, data) {
    return this.inject('POST', url, data);
  }

  delete(url) {
    return this.inject('DELETE', url);
  }

  inject(method, url, data = {}) {
    let options = {
      method: method,
      url: url
    }

    if (data) {
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

function check_cookbook_list_length(resp, exceped) {
  resp.result.statusCode.should.be.equal(200);

  // Now the cookbooks length should be 'exceped'
  let json_result = JSON.parse(resp.payload);
  json_result['data'].length.should.be.equal(exceped);
}

describe('GET:/cookbooks', () => {
  var api;

  before(async() => {
    api_server = new ApiServer('127.0.0.1', 3000);

    var cookbook_mgr = new CookbooksMgr();
    var cookbook_api = new CookbooksAPI(cookbook_mgr);

    api_server.route(cookbook_api.apiSpecs());
    api = new TestAPI(api_server);
  });

  describe('List and CRUD API of cookbooks', () => {
    it('Test GET:/cookbooks without any cookbook', async function (done) {
      try {
        let resp = await api.get('/api/cookbooks');
        check_cookbook_list_length(resp, 0);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('CRUD API of cookbooks', () => {
    it('Test POST:/cookbooks (Add new cookbook)', async function (done) {
      try {
        let data = {
          name: 'test1',
          description: 'description content',
          content: TestData.Spiral
        };

        // List all cookbooks, now the cookbooks length should be 1
        let resp = await api.get('/api/cookbooks');
        check_cookbook_list_length(resp, 0);

        // Create a new cookbook
        resp = await api.post('/api/cookbooks', data);
        resp.result.statusCode.should.be.equal(201);

        let json_result = JSON.parse(resp.payload);

        let created_cookbook = json_result['data'];
        created_cookbook.should.be.not.empty;
        created_cookbook.name.should.be.equal(data.name);
        created_cookbook.description.should.be.equal(data.description);
        created_cookbook.content.should.be.eql(data.content);
        created_cookbook._id.should.be.not.empty;

        // List all cookbooks, now the cookbooks length should be 1
        resp = await api.get('/api/cookbooks');
        check_cookbook_list_length(resp, 1);

        done();
      } catch (err) {
        done(err);
      }
    });
    it('Test DELTE:/cookbooks after add a cookbook', async function (done) {
      try {
        // Create a new cookbook
        let data = {
          name: 'test1',
          description: 'description content',
          content: TestData.Spiral
        };
        let resp = await api.post('/api/cookbooks', data);
        resp.result.statusCode.should.be.equal(201);

        resp = await api.get('/api/cookbooks');
        check_cookbook_list_length(resp, 2);

        let json_result = JSON.parse(resp.payload);
        let cookbooks = json_result['data'];

        for (cookbook of cookbooks) {
          let id = cookbook._id;
          resp = await api.delete(`/api/cookbooks/${id}`);
          resp.result.statusCode.should.be.equal(204);
        }

        done();
      } catch (err) {
        done(err);
      }
    });
  });

});
