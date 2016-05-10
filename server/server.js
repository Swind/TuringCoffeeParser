const ApiServer = require('./src/api_server');
const CookbooksAPI = require('./src/api/cookbooks');
const CookbooksMgr = require('./src/models/cookbooks');

/* ##############################################################
#
#    Global variables
#
###############################################################*/

const ADDR = '0.0.0.0';
const PORT = 3000;

/* ##############################################################
#
#    API Server
#
###############################################################*/

const apiServer = new ApiServer(ADDR, PORT);

// Register Plugins
apiServer.register('inert', require('inert'));
apiServer.register('vision', require('vision'));
apiServer.register('hapi-swagger', require('hapi-swagger'));

/* ###############################################################
#
#    Route
#
###############################################################*/


const cookbookMgr = new CookbooksMgr();
const cookbookApi = new CookbooksAPI(cookbookMgr);

apiServer.route(cookbookApi.apiSpecs());
apiServer.start();
