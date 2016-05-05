var Path = require('path');
var Hapi = require('hapi');
var HttpProxy = require('http-proxy');


//Monkeypatch require for node-dev
require.extensions['.jsx'] = require.extensions['.js'];

var logger = require('./utils/logger');
var ApiServer = require('./server/api_server');
var CookbooksAPI = require('./server/api/cookbooks');
var CookbooksMgr = require('./server/models/cookbooks');

/*##############################################################
#
#    Global variables 
#
###############################################################*/

var ADDR = '0.0.0.0'
var PORT = 3000;

var IS_PRODUCTION = false;
var PUBLIC_PATH = Path.resolve(__dirname, 'public');

global.logger = logger;

/*##############################################################
#
#    API Server 
#
###############################################################*/

api_server = new ApiServer(ADDR, PORT);

// Register Plugins
api_server.register('inert', require('inert'));
api_server.register('vision', require('vision'));
api_server.register('hapi-swagger', require('hapi-swagger'));

/*###############################################################
#
#    Route 
#
###############################################################*/


var cookbook_mgr = new CookbooksMgr();
var cookbook_api = new CookbooksAPI(cookbook_mgr);

api_server.route(cookbook_api.api_specs());
api_server.start();
