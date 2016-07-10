const ApiServer = require('./src/api_server');

const CookbooksAPI = require('./src/api/cookbooks');
const CookbooksMgr = require('./src/models/cookbooks');

const PrinterAPI = require('./src/api/printer');
const Printer = require('./src/models/printer');

const RefillAPI = require('./src/api/refill');
const Refill = require('./src/models/refill');

const HeaterAPI = require('./src/api/heater');
const Heater = require('./src/models/heater');

const BaristaAPI = require('./src/api/barista');
const Barista = require('./src/models/barista');

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

// Cookbooks
const cookbookMgr = new CookbooksMgr("cookbooks.db");
const cookbookAPI = new CookbooksAPI(cookbookMgr);

// Printer
const printer = new Printer();
const printerAPI = new PrinterAPI(printer);

// Heater
const heater = new Heater();
const heaterAPI = new HeaterAPI(heater);

// Refill
const refill = new Refill();
const refillAPI = new RefillAPI(refill);

// Barista
const barista = new Barista(printer, cookbookMgr);
const baristaAPI = new BaristaAPI(barista);

apiServer.route(cookbookAPI.apiSpecs());
apiServer.route(printerAPI.apiSpecs());
apiServer.route(heaterAPI.apiSpecs());
apiServer.route(refillAPI.apiSpecs());
apiServer.route(baristaAPI.apiSpecs());

apiServer.start();
