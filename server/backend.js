require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const ApiServer = __webpack_require__(1);
	
	const CookbooksAPI = __webpack_require__(6);
	const CookbooksMgr = __webpack_require__(9);
	
	const PrinterAPI = __webpack_require__(11);
	const Printer = __webpack_require__(12);
	
	const RefillAPI = __webpack_require__(15);
	const Refill = __webpack_require__(16);
	
	const HeaterAPI = __webpack_require__(17);
	const Heater = __webpack_require__(18);
	
	const BaristaAPI = __webpack_require__(19);
	const Barista = __webpack_require__(20);
	
	/* ##############################################################
	#
	#    Global variables
	#
	###############################################################*/
	
	const ADDR = '0.0.0.0';
	const PORT = 80;
	
	/* ##############################################################
	#
	#    API Server
	#
	###############################################################*/
	
	const apiServer = new ApiServer(ADDR, PORT);
	
	// Register Plugins
	apiServer.register('inert', __webpack_require__(32));
	apiServer.register('vision', __webpack_require__(33));
	apiServer.register('hapi-swagger', __webpack_require__(34));
	
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
	
	apiServer.enable_static_file_server("./public")
	
	apiServer.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Hapi = __webpack_require__(2);
	const logger = __webpack_require__(3);
	
	class APIServer {
	  constructor(address = '127.0.0.0', port = 3000) {
	    this.address = address;
	    this.port = port;
	
	    // HTTP Server
	    this.server = new Hapi.Server();
	
	    this.server.connection({
	      address: this.address,
	      port: this.port,
	    });
	  }
	
	  register(name, plugin, options = {}) {
	    this.server.register({
	      register: plugin,
	      options,
	    }, (err) => {
	      if (err) {
	        logger.error('Failed to load plugin:', err);
	      } else {
	        logger.info('Successed to load plugin:', name);
	      }
	    });
	  }
	
	  route(apis) {
	    for (const api of apis) {
	      logger.info(`Registered ${api.method}:${api.path} - "${api.config.notes}" successfully`);
	      this.server.route(api);
	    }
	  }
	
	  addRoute({
	    method,
	    path,
	    handler,
	    config,
	  }) {
	    this.server.route({
	      method,
	      path,
	      handler,
	      config,
	    });
	  }
	
	  enable_static_file_server(folder_path){
	    this.server.route({
	        method: 'GET',
	        path: '/{param*}',
	        handler: {
	            directory: {
	                path: folder_path,
	                redirectToSlash: true,
	                index: true
	            }
	        }
	    });
	  }
	
	  start() {
	    logger.info('Start the API server ...');
	
	    this.server.start((err) => {
	      if (err) {
	        throw err;
	      } else {
	        logger.info('Server running at:', this.server.info.uri);
	        logger.info('Swagger at:', `${this.server.info.uri}/documentation`);
	      }
	    });
	  }
	}
	
	module.exports = APIServer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("hapi");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {// NOTE: this adds a filename and line number to winston's output
	// Example output: 'info (routes/index.js:34) GET 200 /index'
	
	var winston = __webpack_require__(4)
	var path = __webpack_require__(5)
	var PROJECT_ROOT = path.join(__dirname, '..')
	
	timestamp = () => {
	  return new Date().toLocaleString();
	}
	
	var logger = new winston.Logger({
	      transports: [
	        new (winston.transports.Console) ({
	          colorize: true,
	          prettyPrint: true,
	          depth: true,
	          humanReadableUnhandledException: true,
	          timestamp: timestamp
	        })
	      ]
	    })
	
	// this allows winston to handle output from express' morgan middleware
	logger.stream = {
	  write: function (message) {
	    logger.info(message)
	  }
	}
	
	// A custom logger interface that wraps winston, making it easy to instrument
	// code and still possible to replace winston in the future.
	
	module.exports.debug = module.exports.log = function () {
	  logger.debug.apply(logger, formatLogArguments(arguments))
	}
	
	module.exports.info = function () {
	  logger.info.apply(logger, formatLogArguments(arguments))
	}
	
	module.exports.warn = function () {
	  logger.warn.apply(logger, formatLogArguments(arguments))
	}
	
	module.exports.error = function () {
	  logger.error.apply(logger, formatLogArguments(arguments))
	}
	
	module.exports.stream = logger.stream
	
	/**
	 * Attempts to add file and line number info to the given log arguments.
	 */
	function formatLogArguments (args) {
	  args = Array.prototype.slice.call(args)
	
	  var stackInfo = getStackInfo(1)
	
	  if (stackInfo) {
	    // get file path relative to project root
	    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'
	
	    if (typeof (args[0]) === 'string') {
	      args[0] = calleeStr + ' ' + args[0]
	    } else {
	      args.unshift(calleeStr)
	    }
	  }
	
	  return args
	}
	
	/**
	 * Parses and returns info about the call stack at the given index.
	 */
	function getStackInfo (stackIndex) {
	  // get call stack, and analyze it
	  // get all file, method, and line numbers
	  var stacklist = (new Error()).stack.split('\n').slice(3)
	
	  // stack trace format:
	  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
	  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
	  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi
	
	  var s = stacklist[stackIndex] || stacklist[0]
	  var sp = stackReg.exec(s) || stackReg2.exec(s)
	
	  if (sp && sp.length === 5) {
	    return {
	      method: sp[1],
	      relativePath: path.relative(PROJECT_ROOT, sp[2]),
	      line: sp[3],
	      pos: sp[4],
	      file: path.basename(sp[2]),
	      stack: stacklist.join('\n')
	    }
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("winston");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Joi = __webpack_require__(7);
	const API = __webpack_require__(8);
	
	class CookbooksAPI extends API {
	  constructor(manager) {
	    super();
	    this.manager = manager;
	  }
	
	  /*
	   * List all cookbooks
	   */
	  listSpec() {
	    return {
	      method: 'GET',
	      path: '/api/cookbooks',
	      config: {
	        tags: ['api'],
	        description: 'List all cookbooks',
	        notes: 'List all cookbooks',
	      },
	      handler: this.list.bind(this),
	    };
	  }
	
	  list(request, reply) {
	    this.manager.list((err, cookbooks) => {
	      if (err) {
	        this.failed(reply, 503, err);
	      } else {
	        this.successed(reply, 200, 'List all cookbooks successfully', cookbooks);
	      }
	    });
	  }
	
	  /*
	   * Create a cookbook
	   */
	  createSpec() {
	    return {
	      method: 'POST',
	      path: '/api/cookbooks',
	      config: {
	        tags: ['api'],
	        description: 'Create a new cookbook',
	        notes: 'Create a new cookbook',
	        validate: {
	          payload: {
	            name: Joi.string().required(),
	            description: Joi.string(),
	            processes: Joi.array(),
	          },
	        },
	      },
	      handler: this.create.bind(this),
	    };
	  }
	
	  create(request, reply) {
	    this.manager.create(request.payload, (err, doc) => {
	      if (err) {
	        this.failed(reply, 503, err);
	      } else {
	        this.successed(reply, 201, 'Create the cookbook successfully', doc);
	      }
	    });
	  }
	
	  /*
	   * Update a cookbook
	   */
	  updateSpec() {
	    return {
	      method: 'PUT',
	      path: '/api/cookbooks/{id}',
	      config: {
	        tags: ['api'],
	        description: 'Update the cookbook',
	        notes: 'Update the cookbook',
	        validate: {
	          params: {
	            id: Joi.string().required(),
	          },
	          payload: {
	            name: Joi.string().required(),
	            description: Joi.string(),
	            processes: Joi.array(),
	          },
	        },
	      },
	      handler: this.update.bind(this),
	    };
	  }
	
	  update(request, reply) {
	    const id = request.params.id;
	
	    this.manager.update(id, request.payload, (err, numReplaced) => {
	      if (err) {
	        this.failed(reply, 503, err);
	      } else if (numReplaced === 0) {
	        this.failed(reply, 404, `Can't find the cookbook with id ${id}`);
	      } else {
	        this.successed(reply, 200, `Update cookbook ${id} successfully`);
	      }
	    });
	  }
	
	  /*
	   * Read a cookbook
	   */
	  readSpec() {
	    return {
	      method: 'GET',
	      path: '/api/cookbooks/{id}',
	      config: {
	        tags: ['api'],
	        description: 'Read the cookbook',
	        notes: 'Read the cookbook',
	        validate: {
	          params: {
	            id: Joi.string().required(),
	          },
	        },
	      },
	      handler: this.read.bind(this),
	    };
	  }
	
	  read(request, reply) {
	    const id = request.params.id;
	
	    this.manager.read(request.params.id, (err, cookbook) => {
	      if (err) {
	        this.failed(reply, 503, err);
	      } else if (!cookbook) {
	        this.failed(reply, 404, `Can't find cookbook with id ${id}`);
	      } else {
	        this.successed(reply, 200, `Read the cookbook by id ${id} successfully`, cookbook);
	      }
	    });
	  }
	
	  /*
	   * Delete a cookbook
	   */
	  deleteSpec() {
	    return {
	      method: 'DELETE',
	      path: '/api/cookbooks/{id}',
	      config: {
	        tags: ['api'],
	        description: 'Delete the cookbook',
	        notes: 'Delete the cookbook',
	        validate: {
	          params: {
	            id: Joi.string().required(),
	          },
	        },
	      },
	      handler: this.delete.bind(this),
	    };
	  }
	
	  delete(request, reply) {
	    const id = request.params.id;
	    this.manager.delete(id, (err, numRemoved) => {
	      if (err) {
	        this.failed(reply, 503, err);
	      } else if (numRemoved === 0) {
	        this.failed(reply, 404, `Can't delete cookbook with id ${id}`);
	      } else {
	        this.successed(reply, 204, 'Delete cookbook successfully');
	      }
	    });
	  }
	
	  copySpec() {
	    return {
	      method: 'POST',
	      path: '/api/cookbooks/{id}/copy',
	      config: {
	        tags: ['api'],
	        description: 'Copy the cookbook',
	        notes: 'Copy the cookbook',
	        validate: {
	          params: {
	            id: Joi.string().required(),
	          },
	        },
	      },
	      handler: this.copy.bind(this),
	    };
	  }
	
	  copy(request, reply) {
	    const id = request.params.id;
	    this.manager.read(request.params.id, (err, cookbook) => {
	      if (err) {
	        this.failed(reply, 503, err);
	      } else if (!cookbook) {
	        this.failed(reply, 404, `Can't find cookbook with id ${id}`);
	      } else {
	        delete cookbook['_id'];
	        this.manager.create(cookbook, (err, doc) => {
	          if (err) {
	            this.failed(reply, 503, err);
	          } else {
	            this.successed(reply, 201, 'Copy the cookbook successfully', doc);
	          }
	        });
	      }
	    });
	  }
	
	  apiSpecs() {
	    return [
	      this.listSpec(),
	      this.createSpec(),
	      this.readSpec(),
	      this.updateSpec(),
	      this.deleteSpec(),
	      this.copySpec()
	    ];
	  }
	}
	
	module.exports = CookbooksAPI;


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("joi");

/***/ },
/* 8 */
/***/ function(module, exports) {

	class API {
	  failed(reply, statusCode, message) {
	    reply({
	      statusCode,
	      message,
	    });
	  }
	
	  successed(reply, statusCode, message, data) {
	    const content = {
	      statusCode,
	      message,
	    };
	
	    if (data) {
	      content.data = data;
	    }
	
	    reply(content);
	  }
	}
	
	module.exports = API;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Nedb = __webpack_require__(10);
	
	class CookbookMgr {
	  constructor(dbname, inMemoryOnly = false) {
	    this.db = new Nedb({
	      filename: dbname,
	      autoload: true,
	      inMemoryOnly,
	    });
	  }
	
	  list(callback) {
	    this.db.find({}, (err, docs) => {
	      callback(err, docs);
	    });
	  }
	
	  create(data, callback) {
	    this.db.insert(data, (err, doc) => {
	      callback(err, doc);
	    });
	  }
	
	  update(id, data, callback) {
	    this.db.update({
	      _id: id,
	    }, data, (err, numReplaced) => {
	      callback(err, numReplaced);
	    });
	  }
	
	  read(id, callback) {
	    this.db.findOne({
	      _id: id,
	    }, (err, doc) => {
	      callback(err, doc);
	    });
	  }
	
	  delete(id, callback) {
	    this.db.remove({
	      _id: id,
	    }, (err, numRemoved) => {
	      callback(err, numRemoved);
	    });
	  }
	}
	
	module.exports = CookbookMgr;


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("nedb");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	const Joi = __webpack_require__(7);
	const API = __webpack_require__(8);
	
	class PrinterAPI extends API {
	  constructor(printer) {
	    super();
	    this.printer = printer;
	  }
	
	  statusSpec() {
	    return {
	      method: 'GET',
	      path: '/api/printer',
	      config: {
	        tags: ['api'],
	        description: 'Get the status of the printer',
	        notes: 'Get the status of the printer',
	      },
	      handler: this.status.bind(this),
	    };
	  }
	
	  status(request, reply) {
	    this.successed(reply, 200, 'Get the printer status successfully', this.printer.status);
	  }
	
	  homeSpec() {
	    return {
	      method: 'POST',
	      path: '/api/printer/home',
	      config: {
	        tags: ['api'],
	        description: 'Move the head to the home position',
	        notes: 'Move the head to the home position',
	      },
	      handler: this.home.bind(this),
	    };
	  }
	
	  home(request, reply) {
	    this.printer.home();
	    this.successed(reply, 200, 'Move the head to the home position successfully');
	  }
	
	  jogSpec() {
	    return {
	      method: 'POST',
	      path: '/api/printer/jog',
	      config: {
	        tags: ['api'],
	        description: 'Control the printer to move the head or extrude the water',
	        notes: 'Control the printer to move the head or extrude the water',
	        validate: {
	          payload: {
	            x: Joi.number().integer(),
	            y: Joi.number().integer(),
	            z: Joi.number().integer(),
	            f: Joi.number().integer(),
	          },
	        },
	      },
	      handler: this.jog.bind(this),
	    };
	  }
	
	  jog(request, reply) {
	    const payload = request.payload
	    this.printer.jog(payload.x, payload.y, payload.z, payload.f);
	    this.successed(reply, 200, 'Send the jog command to the printer successfully');
	  }
	
	  apiSpecs() {
	    return [
	      this.statusSpec(),
	      this.homeSpec(),
	      this.jogSpec(),
	    ];
	  }
	}
	
	module.exports = PrinterAPI;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	const Channel = __webpack_require__(13);
	
	const PRINTER_PUB_ADDRESS = 'ipc:///tmp/printer_pub_channel';
	const PRINTER_CMD_ADDRESS = 'ipc:///tmp/printer_cmd_channel';
	
	const PRINTER = 'printer';
	
	class Printer {
	  constructor() {
	    // The monitor will call the callback function when receive the message from subscribed channel.
	    this.monitor = new Channel.Monitor;
	    this.monitor.subscribe(PRINTER_PUB_ADDRESS, PRINTER, this.updateStatusByMonitor.bind(this));
	    this.cmd = new Channel.CmdChannel(PRINTER_CMD_ADDRESS);
	
	    // Save the latest printer status (Should we save the history of status ?)
	    this.status = {};
	    this.last_status_update_time = 0;
	
	    this.total_sent_cmd = 0;
	  }
	
	  updateStatusByMonitor(data) {
	    const updateIfExisting = (name) => {
	      if (name in data) {
	        this.status[name] = data[name];
	      }
	    };
	
	    // The printer server will publish three types status.
	    // So we need to check the content is existing or not.
	    updateIfExisting('state');
	    updateIfExisting('state_string');
	    updateIfExisting('progress');
	
	    const date = new Date();
	    this.last_update_time = date.getTime();
	  }
	
	  send_points(points) {
	    this.cmd.send({
	      "points": points,
	    });
	  }
	
	  send_cancle() {
	    this.cmd.send({
	      "cancle": True,
	    });
	  }
	}
	
	module.exports = Printer;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	const Nanomsg = __webpack_require__(14);
	const logger = __webpack_require__(3);
	
	class Monitor {
	  constructor() {
	    this.subscribers = {};
	  }
	
	  updateData(name, msg) {
	    const sub = this.subscribers[name];
	    sub.data = JSON.parse(msg);
	    logger.info(`${name}: ${JSON.stringify(sub.data, null, 2)}`)
	
	    const d = new Date();
	    sub.last_updated_time = d.getTime();
	
	    if (sub.action != null) {
	      sub.action(msg);
	    }
	  }
	
	  subscribe(address, name, action = null) {
	    const sock = Nanomsg.socket('sub');
	    sock.connect(address);
	    sock.on('data', this.updateData.bind(this, name));
	
	    const sub = {};
	    sub.socket = sock;
	    sub.name = name;
	    sub.action = action;
	    sub.data = {};
	    sub.last_updated_time = 0;
	
	    this.subscribers[name] = sub;
	  }
	
	  getData(name) {
	    let data = {};
	    if (name in this.subscribers) {
	      data = this.subscribers[name].data;
	    }
	
	    return data;
	  }
	
	  getLastUpdatedTime(name) {
	    const sub = this.subscribers[name];
	    return sub.last_updated_time;
	  }
	
	  close(name) {
	    this.subscribers[name].socket.close();
	    delete this.subscribers[name];
	  }
	
	  closeAll() {
	    for (const [key, value] of this.subscribers) {
	      logger.info(`Close the ${key} channel`);
	      value.socket.close();
	    }
	    this.subscribers = {};
	  }
	}
	
	class CmdChannel {
	  constructor(address, callback = null) {
	    this.sock = Nanomsg.socket('pair');
	    this.sock.connect(address);
	    this.sock.on('data', this.replyHandler.bind(this));
	
	    this.callback = callback;
	  }
	
	  replyHandler(msg) {
	    if (this.callback) {
	      this.callback(JSON.parse(msg));
	    }
	  }
	
	  send(jsonObj) {
	    this.sock.send(JSON.stringify(jsonObj));
	  }
	
	  close() {
	    this.sock.close();
	  }
	}
	
	module.exports = {
	  Monitor,
	  CmdChannel,
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("nanomsg");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	const API = __webpack_require__(8);
	
	class RefillAPI extends API {
	  constructor(refill) {
	    super();
	    this.refill = refill;
	  }
	
	  statusSpec() {
	    return {
	      method: 'GET',
	      path: '/api/refill',
	      config: {
	        tags: ['api'],
	        description: 'Get the refill status',
	        notes: 'Get the refill status',
	      },
	      handler: this.status.bind(this),
	    };
	  }
	
	  status(request, reply) {
	    this.successed(reply, 200, 'Get the refill status', this.refill.status);
	  }
	
	  apiSpecs() {
	    return [
	      this.statusSpec(),
	    ];
	  }
	}
	
	module.exports = RefillAPI;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	const Channel = __webpack_require__(13);
	
	const NAME = 'refill';
	const PUB_ADDRESS = `ipc:///tmp/${NAME}_pub_channel`;
	const CMD_ADDRESS = `ipc:///tmp/${NAME}_cmd_channel`;
	
	class Refill {
	  constructor() {
	    this.monitor = new Channel.Monitor;
	    /* The message example from the heater server
	      {
	        full: True
	      }
	    */
	    this.monitor.subscribe(PUB_ADDRESS, NAME, this.update_status);
	  }
	
	  isFull() {
	    return this.monitor.getData(NAME).full;
	  }
	
	  get status() {
	    return this.monitor.getData(NAME);
	  }
	
	  get lastUpdatedTime() {
	    return this.monitor.getLastUpdatedTime(NAME);
	  }
	}
	
	module.exports = Refill;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	const Joi = __webpack_require__(7);
	const API = __webpack_require__(8);
	
	class HeaterAPI extends API {
	  constructor(heater) {
	    super();
	    this.heater = heater;
	  }
	
	  statusSpec() {
	    return {
	      method: 'GET',
	      path: '/api/heater',
	      config: {
	        tags: ['api'],
	        description: 'Get the heater status',
	        notes: 'Get the heater status',
	      },
	      handler: this.status.bind(this),
	    };
	  }
	
	  status(request, reply) {
	    this.successed(reply, 200, 'Get the heater status', this.heater.status);
	  }
	
	  setTemperatureSpec() {
	    return {
	      method: 'POST',
	      path: '/api/heater',
	      config: {
	        tags: ['api'],
	        description: 'Set the heater temperature',
	        notes: 'Set the heater temperature',
	        validate: {
	          payload: {
	            temperature: Joi.number().integer().required(),
	          },
	        },
	      },
	      handler: this.setTemperature.bind(this),
	    };
	  }
	
	  setTemperature(request, reply) {
	    const temperature = request.payload.temperature;
	    this.heater.setTemperature(temperature);
	    this.successed(reply, 200, 'Set the temperature successfully');
	  }
	
	  apiSpecs() {
	    return [
	      this.statusSpec(),
	      this.setTemperatureSpec(),
	    ];
	  }
	}
	
	module.exports = HeaterAPI;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	const Channel = __webpack_require__(13);
	
	const NAME = 'printer';
	const PUB_ADDRESS = `ipc:///tmp/${NAME}_pub_channel`;
	const CMD_ADDRESS = `ipc:///tmp/${NAME}_cmd_channel`;
	
	const OUTPUT_NAME = 'output'
	const OUTPUT_PUB_ADDRESS = `ipc:///tmp/${OUTPUT_NAME}_pub_channel`
	
	class Heater {
	  // The default value if for the PID
	  constructor(k = 70, i = 165, d = 16, cycleTime = 1) {
	    this.monitor = new Channel.Monitor;
	    /* The message example from the heater server
	      {
	        cycle_time: 5,
	        duty_cycle: 70,
	        set_point: 80,
	        temperature: 26.53,
	      }
	    */
	    this.k = k;
	    this.i = i;
	    this.d = d;
	    this.cycleTime = cycleTime;
	
	    this.monitor.subscribe(PUB_ADDRESS, NAME, null);
	    this.cmd = new Channel.CmdChannel(CMD_ADDRESS);
	
	    /* The message example from the output server
	     * {
	     *  temperature: 60
	     * }
	     */
	    this.monitor.subscribe(OUTPUT_PUB_ADDRESS, OUTPUT_NAME, null)
	  }
	
	  get status() {
	    /* The status example
	      {
	        cycle_time: 5,
	        duty_cycle: 70,
	        set_point: 80,
	        temperature: 26.53,
	        output_temperature: 60 
	      }
	    */
	    let heater_status = this.monitor.getData(NAME);
	    let output_status = this.monitor.getData(OUTPUT_NAME);
	
	    return {
	      cycle_time: heater_status.cycle_time,
	      duty_cycle: heater_status.duty_cycle,
	      set_point: heater_status.set_point,
	      temperature: heater_status.temperature,
	      output_temperature: output_status.temperature
	    }
	  }
	
	  get lastUpdatedTime() {
	    return this.monitor.getLastUpdatedTime(NAME);
	  }
	
	  setTemperature(temperature) {
	    const payload = {
	      cycle_time: this.cycleTime,
	      k: this.k,
	      i: this.i,
	      d: this.d,
	      set_point: temperature,
	    };
	
	    this.cmd.send(payload);
	  }
	}
	
	module.exports = Heater;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	const Joi = __webpack_require__(7);
	const API = __webpack_require__(8);
	
	class BaristaAPI extends API {
	  constructor(barista) {
	    super();
	    this.barista = barista;
	  }
	
	  brewSpec() {
	    return {
	      method: 'POST',
	      path: '/api/barista/brew',
	      config: {
	        tags: ['api'],
	        description: 'Add cookbook into queue',
	        notes: 'Add cookbook into queue',
	        validate: {
	          payload: {
	            id: Joi.string().required(),
	          }
	        }
	      },
	      handler: this.brew.bind(this),
	    };
	  }
	
	  brew(request, reply) {
	    const payload = request.payload;
	    console.log(payload);
	    if (this.barista.brew(payload.id) !== 0) {
	    }
	    this.successed(reply, 200, 'Brew successful');
	  }
	
	  jogSpec() {
	    return {
	      method: 'POST',
	      path: '/api/barista/jog',
	      config: {
	        tags: ['api'],
	        description: 'Control the printer to move the head or extrude the water',
	        notes: 'Control the printer to move the head or extrude the water',
	        validate: {
	          payload: {
	            x: Joi.number().integer(),
	            y: Joi.number().integer(),
	            z: Joi.number().integer(),
	            f: Joi.number().integer(),
	            e: Joi.number().integer(),
	            t: Joi.number().integer(),
	          },
	        },
	      },
	      handler: this.jog.bind(this),
	    };
	  }
	
	  jog(request, reply) {
	    const payload = request.payload
	    this.barista.jog(payload.x, payload.y, payload.z, payload.e, payload.f, t=payload.t);
	    this.successed(reply, 200, 'Send the jog command to the printer successfully');
	  }
	
	
	  apiSpecs() {
	    return [
	      this.brewSpec(),
	      this.jogSpec()
	    ];
	  }
	}
	
	module.exports = BaristaAPI;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	const Refill = __webpack_require__(16);
	const Printer = __webpack_require__(12);
	const Processes = __webpack_require__(21)
	const Home = __webpack_require__(30)
	const Wait = __webpack_require__(29)
	const Point = __webpack_require__(23).Point
	
	class Barista {
	  constructor(printer, cookbookMgr) {
	    this.printer = printer;
	    this.cookbookMgr = cookbookMgr;
	  }
	
	  brew(id) {
	    this.cookbookMgr.read(id, (err, cookbook) => {
	      if (err) {
	        return err;
	      }
	
	      let all_points = Processes.load(cookbook.processes)
	      this.printer.send_points(all_points);
	
	      return 0;
	    });
	  }
	
	  home(){
	    let home_obj = Process.createProcess(Home.default());
	    this.printer.send_points([home_obj]);
	
	    return 0;
	  }
	
	  jog(x, y, z, e, f, t){
	    let point = new Point(x, y, f);
	    point.z = z;
	    point.e = e;
	    point.t = t;
	
	    this.printer.send_points([point]);
	
	    return 0;
	  }
	}
	
	module.exports = Barista;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	const Circle = __webpack_require__(22);
	const FixedPoint = __webpack_require__(26);
	const Spiral = __webpack_require__(27);
	const SpiralTotalWater = __webpack_require__(28);
	const Wait = __webpack_require__(29);
	const Home = __webpack_require__(30);
	const Move = __webpack_require__(31);
	
	var _processes = {
	  "circle": Circle,
	  "fixed_point": FixedPoint,
	  "spiral": Spiral,
	  "spiral total water": SpiralTotalWater,
	  "wait": Wait,
	  "home": Home,
	  "move": Move,
	}
	
	var _processes_pipeline = [
	]
	
	
	function createProcess(params){
	    return new _processes[params.name](params);
	}
	
	function load(processes_json){
	
	  // Create process class from process json config
	  let process_list = []
	  let all_points = []
	
	  processes_json.forEach(function (process){
	    process_obj = createProcess(process);
	    process_list = process_list.concat(process_obj.points);
	  });
	
	  // Let pipeline to handle all processes
	  _processes_pipeline.forEach(function(pipeline){
	    process_list = pipeline(process_list);
	  });
	
	  process_list.forEach(function (process){
	    all_points = all_points.concat(process.points);
	  });
	
	  return all_points
	}
	
	module.exports = {
	  load
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	const Point = Base.Point;
	
	class Circle extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'process',
	      name: 'circle',
	      radius: {
	        start: 20, // mm
	      },
	      high: {
	        start: 300, // mm
	        end: 300,
	      },
	      cylinder: 5,
	      total_water: 0, // mm
	      point_interval: 2.0, // mm
	      feedrate: 80, // mm
	      extrudate: 0.2, // ml/mm
	      temperature: 60 // C
	    })
	  }
	
	  constructor(params = Circle.default) {
	    super(params);
	
	    this.point_number = this.length / this.params.point_interval;
	  }
	
	  get time() {
	    return this.length / this.params.feedrate * 60;
	  }
	
	  get water() {
	    return this.params.total_water;
	  }
	
	  get length() {
	    return this.params.total_water / this.params.extrudate;
	  }
	
	  get _points() {
	    const circumference = 2 * Math.pi * this.params.radius.start;
	    const cylinder = this.length / circumference;
	    const av = (2 * Math.Pi * cylinder) / this.point_number;
	
	    const points = [];
	
	    for (let index = 0; index < this.point_number; index++) {
	      const x = this.params.radius * Math.cos(av * index);
	      const y = this.params.radius * Math.sin(av * index);
	      const f = this.params.feedrate;
	
	      const point = new Point(x, y, f);
	      point.e = this.water / this.length;
	      points.push(point);
	    }
	
	    return points;
	  }
	}
	
	module.exports = Circle;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// MiddleWares
	const zAixs = __webpack_require__(24);
	const Temperature = __webpack_require__(25);
	
	class Point {
	  constructor(x = null, y = null, f = null) {
	    /*
	     * x : x aixs
	     * y : y aixs
	     * z : z aixs
	     * f : feed rate
	     * t : temperature
	     */
	
	    this.type = 'point'
	    this.x = x;
	    this.y = y;
	    this.f = f;
	    this.e = 0;
	    this.z = null;
	    this.t = null;
	  }
	
	  get json() {
	    return JSON.stringify(this);
	  }
	}
	
	class Command {
	  constructor(command) {
	    this.type = 'command'
	    this.name = command
	  }
	
	  get json() {
	    return JSON.stringify(this);
	  }
	}
	
	class MixCommand extends Command {
	  constructor(temperature) {
	    super('mix')
	    this.t = temperature
	  }
	}
	
	class CalibrationCommand extends Command {
	  constructor(temperature) {
	    super('calibration')
	    this.t = temperature
	  }
	}
	
	class HomeCommand extends Command {
	  constructor() {
	    super('home')
	  }
	}
	
	class WaitCommand extends Command {
	  constructor(second) {
	    super('wait')
	    this.time = second
	  }
	}
	
	class Process {
	  constructor(params) {
	    this.middleWares = [zAixs, Temperature];
	    this.params = params;
	  }
	
	  registerMiddleWare(middleWare) {
	    this.middleWares.push(middleWare);
	  }
	
	  get time() {
	    return undefined;
	  }
	
	  get water() {
	    return undefined;
	  }
	
	  get length() {
	    return undefined;
	  }
	
	  get _points(){
	    return []
	  }
	
	  get points(){
	    let points = this._points;
	
	    for (const middleWare of this.middleWares) {
	      points = middleWare(points, this.params);
	    }
	
	    points = this.post_action(points);
	
	    return points
	  }
	
	  radians(degress) {
	    return degress * Math.PI / 180;
	  }
	
	  post_action(points){
	    return points
	  }
	}
	
	module.exports = {
	  Point,
	  Process,
	  WaitCommand,
	  HomeCommand,
	  MixCommand,
	  CalibrationCommand,
	};


/***/ },
/* 24 */
/***/ function(module, exports) {

	function zAixs(points, params){
	
	  if (params.high === undefined) {
	    return points;
	  }
	
	  if (params.name === 'fixed_point') {
	    return points;
	  }
	
	  const startH = params.high.start;
	  const endH = (params.high.end !== undefined)? params.high.end: startH;
	  const diffH = endH - startH;
	
	  for(let i = 0; i < points.length; i++){
	    points[i].z = startH + (diffH/points.length) * i;
	  }
	
	  return points;
	}
	
	module.exports = zAixs;


/***/ },
/* 25 */
/***/ function(module, exports) {

	function temperature(points, params){
	
	  if (params.temperature === undefined) {
	    return points;
	  }
	
	  for(let i = 0; i < points.length; i++){
	    points[i].t = params.temperature
	  }
	
	  return points;
	}
	
	module.exports = temperature;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	const Point = Base.Point;
	
	const QUICK_MOVE_F = 5000;
	
	class FixedPoint extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'process',
	      name: 'fixed_point',
	      coordinates: {
	        x: 0, // mm
	        y: 0, // mm
	      },
	      high: {
	        start: 300, // mm
	        end: 300,
	      },
	      total_water: 100, // mm
	      point_interval: 1.0, // mm
	      feedrate: 80, // mm
	      extrudate: 0.2, // ml/mm
	      temperature: 60, // C
	    })
	  }
	
	  constructor(params = FixedPoint.default) {
	    super(params);
	
	    this.point_number = this.length / this.params.point_interval;
	  }
	
	  get time() {
	    return (this.params.total_water / this.params.extrudate) / this.params.feedrate * 60;
	  }
	
	  get water() {
	    return this.params.total_water;
	  }
	
	  get length() {
	    return this.params.total_water / this.params.extrudate;
	  }
	
	  get _points() {
	    const x = this.params.coordinates.x;
	    const y = this.params.coordinates.y;
	
	    const points = [];
	
	    // Quick move to the start point.
	    let move = new Point(x, y, QUICK_MOVE_F)
	    points.push(move)
	
	    for (let i = 0; i < this.length; i++) {
	      let p = new Point(null, null, this.params.extrudate)
	      p.e = this.water / this.length
	      p.f = this.params.feedrate
	      points.push(p)
	    }
	
	    return points;
	  }
	
	  post_action(points){
	    points[0].e = 0;
	
	    return points;
	  }
	}
	
	module.exports = FixedPoint;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	const Point = Base.Point;
	
	class Spiral extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'process',
	      name: 'spiral',
	      radius: {
	        start: 10, // mm
	        end: 20, // mm
	      },
	      high: {
	        start: 300, // mm
	        end: 300,
	      },
	      cylinder: 5,
	      point_interval: 2.0, // mm
	      feedrate: 80, // mm
	      extrudate: 0.2, // ml/mm
	      temperature: 60, // C
	    })
	  }
	
	  constructor(params = Spiral.default) {
	    super(params);
	    this.created_points = this.generatePoints();
	  }
	
	  get time() {
	    return this.length / this.params.feedrate * 60;
	  }
	
	  get water() {
	    return this.created_points.length * this.params.extrudate;
	  }
	
	  get length() {
	    return this.created_points.length * this.params.point_interval;
	  }
	
	  get _points() {
	    return this.created_points;
	  }
	
	  generatePoints() {
	    const maxTheta = this.radians(this.params.cylinder * 360);
	    // a is acceleration
	    const a = (this.params.radius.end - this.params.radius.start) / maxTheta;
	
	    let totalTheta = 0;
	    const points = [];
	
	    const e = this.params.extrudate;
	    while (totalTheta <= maxTheta) {
	      // point interval / (2 * pi * r) = theta for one step
	      const nowRadius = a * totalTheta + this.params.radius.start;
	      const nowTheta = this.radians((this.params.point_interval / (2 * Math.PI * nowRadius)) * 360);
	
	      totalTheta = totalTheta + nowTheta;
	
	      const x = nowRadius * Math.cos(totalTheta);
	      const y = nowRadius * Math.sin(totalTheta);
	
	      let p = new Point(x, y, this.params.feedrate);
	      p.e = e;
	      // Create the point object to save the information
	      points.push(p);
	    }
	    return points;
	  }
	}
	
	module.exports = Spiral;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	
	class SpiralTotalWater extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'process',
	      name: 'spiral total water',
	      radius: {
	        start: 10, // mm
	        end: 20, // mm
	      },
	      high: {
	        start: 300, // mm
	        end: 300,
	      },
	      cylinder: 5,
	      point_interval: 2.0, // mm
	      total_water: 60, // ml
	      total_time: 30, // sec
	      temperature: 60, // C
	    })
	  }
	
	  constructor(params) {
	    super(params);
	
	    this.created_points = this.generatePoints();
	  }
	
	  get time() {
	    return this.params.total_time;
	  }
	
	  set time(sec) {
	    this.params.total_time = sec;
	  }
	
	  get water() {
	    return this.params.total_water;
	  }
	
	  set water(ml) {
	    this.params.total_water = ml;
	  }
	
	  get length() {
	    return this.params.point_interval * (this.created_points.length - 1);
	  }
	
	  get _points() {
	    return this.created_points;
	  }
	
	  generatePoints() {
	    const maxTheta = this.radians(this.params.cylinder * 360);
	    // a is acceleration
	    const a = (this.params.radius.end - this.params.radius.start) / maxTheta;
	
	    let totalTheta = 0;
	    const points = [];
	
	    while (totalTheta <= maxTheta) {
	      // point interval / (2 * pi * r) = theta for one step
	      const nowRadius = a * totalTheta + this.params.radius.start;
	      const nowTheta = this.radians((this.params.point_interval / (2 * Math.PI * nowRadius)) * 360);
	
	      totalTheta = totalTheta + nowTheta;
	
	      const x = nowRadius * Math.cos(totalTheta);
	      const y = nowRadius * Math.sin(totalTheta);
	
	      // Create the point object to save the information
	      points.push(new Base.Point(x, y));
	    }
	
	    // f
	    const totalLen = this.params.point_interval * (points.length - 1);
	    const f = (totalLen * 60) / this.params.total_time;
	    const e = this.water / points.length
	
	    for (const point of points) {
	      point.f = f;
	      point.e = e;
	    }
	
	    return points;
	  }
	}
	
	module.exports = SpiralTotalWater;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	const WaitCommand = Base.WaitCommand;
	
	
	class Wait extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'command',
	      name: 'wait',
	      total_time: 30
	    })
	  }
	
	  constructor(params = Wait.default) {
	    super(params);
	  }
	
	  get time() {
	    return this.params.total_time;
	  }
	
	  get water() {
	    return 0;
	  }
	
	  get length() {
	    return 0;
	  }
	
	  get points() {
	    return [
	      new WaitCommand(this.params.total_time)
	    ];
	  }
	}
	
	module.exports = Wait;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	const HomeCommand = Base.HomeCommand;
	
	
	class Home extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'command',
	      name: 'home',
	    })
	  }
	
	  constructor(params = Home.default) {
	    super(params);
	  }
	
	  get time() {
	    return 0;
	  }
	
	  get water() {
	    return 0;
	  }
	
	  get length() {
	    return 0;
	  }
	
	  get points() {
	    return [
	      new HomeCommand()
	    ];
	  }
	}
	
	module.exports = Home


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	const Base = __webpack_require__(23);
	const Point = Base.Point;
	
	const QUICK_MOVE_F = 5000;
	
	class Move extends Base.Process {
	
	  static get default() {
	    return Object.assign({}, {
	      type: 'process',
	      name: 'move',
	      coordinates: {
	        x: 0,
	        y: 0,
	      },
	      high: {
	        start: 300,
	      },
	    })
	  }
	
	  constructor(params = Move.default) {
	    super(params);
	  }
	
	  get time() {
	    return 0;
	  }
	
	  get water() {
	    return 0;
	  }
	
	  get length() {
	    return 1;
	  }
	
	  get _points() {
	    const x = this.params.coordinates.x;
	    const y = this.params.coordinates.y;
	
	    const points = [];
	
	    // Quick move to the start point.
	    let move = new Point(x, y, QUICK_MOVE_F)
	    points.push(move)
	
	    return points;
	  }
	}
	
	module.exports = Move;


/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("inert");

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("vision");

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("hapi-swagger");

/***/ }
/******/ ]);
//# sourceMappingURL=backend.js.map