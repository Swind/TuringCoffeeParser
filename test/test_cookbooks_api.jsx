var TestData = require('./testdata');
var Assert = require('assert');
var Chai = require('chai');
var Supertest = require('supertest');

var ApiServer = require('../server/api_server');
var CookbooksAPI = require('../server/api/cookbooks');
var CookbooksMgr = require('../server/models/cookbooks');

var logger = require('../utils/logger');
global.logger = logger;

Chai.should();

describe('GET:/cookbooks', ()=>{
  var api;

  before(()=>{
    api_server = new ApiServer('127.0.0.1', 3000);

    var cookbook_mgr = new CookbooksMgr();
    var cookbook_api = new CookbooksAPI(cookbook_mgr);

    api_server.route(cookbook_api.api_specs());
  });

  describe('List and CRUD API of cookbooks', ()=>{
    it('Test GET:/cookbooks', (done)=>{
      let hapi = api_server.server;

      let data = {
        name: 'test1',
        description: 'description content',
        content: TestData.spiral
      };

      let options = {
        method: 'GET',
        url: '/api/cookbooks'
      };

      hapi.inject(options, (response)=>{
        json_result = JSON.parse(response.payload);
        json_result['data'].should.be.empty;
        done();
      });

    });
  });
});
