const TestData = require('./testdata');
const Chai = require('chai');

const ApiServer = require('../src/api_server');
const CookbooksAPI = require('../src/api/cookbooks');
const CookbooksMgr = require('../src/models/cookbooks');

const logger = require('libs/utils/logger');

Chai.should();

class TestAPI {
  constructor(apiServer) {
    this.server = apiServer.server;
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
    const options = {
      method,
      url,
    };

    if (data) {
      options.payload = data;
    }

    return this.server.inject(options);
  }
}

function checkCookbookListLength(resp, exceped) {
  resp.result.statusCode.should.be.equal(200);

  // Now the cookbooks length should be 'exceped'
  const jsonResult = JSON.parse(resp.payload);
  jsonResult.data.length.should.be.equal(exceped);
}

describe('GET:/cookbooks', () => {
  var api;

  before(async() => {
    api_server = new ApiServer('127.0.0.1', 3000);

    var cookbook_mgr = new CookbooksMgr("cookbooks.db", inMemoryOnly=true);
    var cookbook_api = new CookbooksAPI(cookbook_mgr);

    api_server.route(cookbook_api.apiSpecs());
    api = new TestAPI(api_server);
  });

  describe('List and CRUD API of cookbooks', () => {
    it('Test GET:/cookbooks without any cookbook', async function (done) {
      try {
        const resp = await api.get('/api/cookbooks');
        checkCookbookListLength(resp, 0);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  describe('CRUD API of cookbooks', () => {
    it('Test POST:/cookbooks (Add new cookbook)', async function (done) {
      try {
        const data = {
          name: 'test1',
          description: 'description content',
          processes: [TestData.Spiral]
        };

        // List all cookbooks, now the cookbooks length should be 1
        let resp = await api.get('/api/cookbooks');
        checkCookbookListLength(resp, 0);

        // Create a new cookbook
        resp = await api.post('/api/cookbooks', data);
        resp.result.statusCode.should.be.equal(201);

        const jsonResult = JSON.parse(resp.payload);

        const createdCookbook = jsonResult.data;
        createdCookbook.should.be.not.empty;
        createdCookbook.name.should.be.equal(data.name);
        createdCookbook.description.should.be.equal(data.description);
        createdCookbook.processes.length.should.be.equal(data.processes.length);
        createdCookbook._id.should.be.not.empty;

        // List all cookbooks, now the cookbooks length should be 1
        resp = await api.get('/api/cookbooks');
        checkCookbookListLength(resp, 1);

        done();
      } catch (err) {
        done(err);
      }
    });

    it('Test DELTE:/cookbooks after add a cookbook', async function (done) {
      try {
        // Create a new cookbook
        const data = {
          name: 'test1',
          description: 'description content',
          processes: [TestData.Spiral]
        };
        let resp = await api.post('/api/cookbooks', data);
        resp.result.statusCode.should.be.equal(201);

        resp = await api.get('/api/cookbooks');
        checkCookbookListLength(resp, 2);

        const jsonResult = JSON.parse(resp.payload);
        const cookbooks = jsonResult.data;

        for (const cookbook of cookbooks) {
          const id = cookbook._id;
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
