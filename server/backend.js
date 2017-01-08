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
	apiServer.register('inert', __webpack_require__(131));
	apiServer.register('vision', __webpack_require__(132));
	apiServer.register('hapi-swagger', __webpack_require__(133));
	
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

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	// NOTE: this adds a filename and line number to winston's output
	// Example output: 'info (routes/index.js:34) GET 200 /index'
	
	var winston = __webpack_require__(4);
	var path = __webpack_require__(5);
	var PROJECT_ROOT = path.join(__dirname, '..');
	
	var timestamp = function timestamp() {
	  return new Date().toLocaleString();
	};
	
	var logger = new winston.Logger({
	  transports: [new winston.transports.Console({
	    colorize: true,
	    prettyPrint: true,
	    depth: true,
	    humanReadableUnhandledException: true,
	    timestamp: timestamp
	  })]
	});
	
	// this allows winston to handle output from express' morgan middleware
	logger.stream = {
	  write: function write(message) {
	    logger.info(message);
	  }
	};
	
	// A custom logger interface that wraps winston, making it easy to instrument
	// code and still possible to replace winston in the future.
	
	module.exports.debug = module.exports.log = function () {
	  logger.debug.apply(logger, formatLogArguments(arguments));
	};
	
	module.exports.info = function () {
	  logger.info.apply(logger, formatLogArguments(arguments));
	};
	
	module.exports.warn = function () {
	  logger.warn.apply(logger, formatLogArguments(arguments));
	};
	
	module.exports.error = function () {
	  logger.error.apply(logger, formatLogArguments(arguments));
	};
	
	module.exports.stream = logger.stream;
	
	/**
	 * Attempts to add file and line number info to the given log arguments.
	 */
	function formatLogArguments(args) {
	  args = Array.prototype.slice.call(args);
	
	  var stackInfo = getStackInfo(1);
	
	  if (stackInfo) {
	    // get file path relative to project root
	    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';
	
	    if (typeof args[0] === 'string') {
	      args[0] = calleeStr + ' ' + args[0];
	    } else {
	      args.unshift(calleeStr);
	    }
	  }
	
	  return args;
	}
	
	/**
	 * Parses and returns info about the call stack at the given index.
	 */
	function getStackInfo(stackIndex) {
	  // get call stack, and analyze it
	  // get all file, method, and line numbers
	  var stacklist = new Error().stack.split('\n').slice(3);
	
	  // stack trace format:
	  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
	  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
	  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
	  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
	
	  var s = stacklist[stackIndex] || stacklist[0];
	  var sp = stackReg.exec(s) || stackReg2.exec(s);
	
	  if (sp && sp.length === 5) {
	    return {
	      method: sp[1],
	      relativePath: path.relative(PROJECT_ROOT, sp[2]),
	      line: sp[3],
	      pos: sp[4],
	      file: path.basename(sp[2]),
	      stack: stacklist.join('\n')
	    };
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
	
	const NAME = 'heater';
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
	const Home = __webpack_require__(127)
	const Wait = __webpack_require__(126)
	const Point = __webpack_require__(113).Point
	
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

	'use strict';
	
	var Circle = __webpack_require__(22);
	var FixedPoint = __webpack_require__(123);
	var Spiral = __webpack_require__(124);
	var SpiralTotalWater = __webpack_require__(125);
	var Wait = __webpack_require__(126);
	var Home = __webpack_require__(127);
	var Move = __webpack_require__(128);
	var Calibration = __webpack_require__(129);
	var Mix = __webpack_require__(130);
	
	var _processes = {
	  "mix": Mix,
	  "circle": Circle,
	  "fixed_point": FixedPoint,
	  "spiral": Spiral,
	  "spiral total water": SpiralTotalWater,
	  "wait": Wait,
	  "home": Home,
	  "move": Move,
	  "calibration": Calibration
	};
	
	var _processes_pipeline = [];
	
	function createProcess(params) {
	  return new _processes[params.name](params);
	}
	
	function load(processes_json) {
	
	  // Create process class from process json config
	  var process_list = [];
	  var all_points = [];
	
	  processes_json.forEach(function (process) {
	    var process_obj = createProcess(process);
	    process_list = process_list.concat(process_obj);
	  });
	
	  // Let pipeline to handle all processes
	  _processes_pipeline.forEach(function (pipeline) {
	    process_list = pipeline(process_list);
	  });
	
	  process_list.forEach(function (process) {
	    all_points = all_points.concat(process.points);
	  });
	
	  return all_points;
	}
	
	module.exports = {
	  load: load
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var Point = Base.Point;
	
	var Circle = function (_Base$Process) {
	  (0, _inherits3.default)(Circle, _Base$Process);
	  (0, _createClass3.default)(Circle, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'process',
	        name: 'circle',
	        radius: {
	          start: 20 },
	        high: {
	          start: 300, // mm
	          end: 300
	        },
	        cylinder: 5,
	        total_water: 0, // mm
	        point_interval: 2.0, // mm
	        feedrate: 80, // mm
	        extrudate: 0.2, // ml/mm
	        temperature: 60 // C
	      });
	    }
	  }]);
	
	  function Circle(params) {
	    (0, _classCallCheck3.default)(this, Circle);
	
	    params = params || Circle.default;
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (Circle.__proto__ || (0, _getPrototypeOf2.default)(Circle)).call(this, params));
	
	    _this.point_number = _this.length / _this.params.point_interval;
	    return _this;
	  }
	
	  (0, _createClass3.default)(Circle, [{
	    key: 'time',
	    get: function get() {
	      return this.length / this.params.feedrate * 60;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return this.params.total_water;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return this.params.total_water / this.params.extrudate;
	    }
	  }, {
	    key: '_points',
	    get: function get() {
	      var circumference = 2 * Math.pi * this.params.radius.start;
	      var cylinder = this.length / circumference;
	      var av = 2 * Math.Pi * cylinder / this.point_number;
	
	      var points = [];
	
	      for (var index = 0; index < this.point_number; index++) {
	        var x = this.params.radius * Math.cos(av * index);
	        var y = this.params.radius * Math.sin(av * index);
	        var f = this.params.feedrate;
	
	        var point = new Point(x, y, f);
	        point.e = this.water / this.length;
	        points.push(point);
	      }
	
	      return points;
	    }
	  }]);
	  return Circle;
	}(Base.Process);
	
	module.exports = Circle;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(24), __esModule: true };

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25);
	module.exports = __webpack_require__(36).Object.getPrototypeOf;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(26)
	  , $getPrototypeOf = __webpack_require__(28);
	
	__webpack_require__(34)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(27);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(29)
	  , toObject    = __webpack_require__(26)
	  , IE_PROTO    = __webpack_require__(30)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(31)('keys')
	  , uid    = __webpack_require__(33);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(32)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 33 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(35)
	  , core    = __webpack_require__(36)
	  , fails   = __webpack_require__(45);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(32)
	  , core      = __webpack_require__(36)
	  , ctx       = __webpack_require__(37)
	  , hide      = __webpack_require__(39)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 36 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(38);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(40)
	  , createDesc = __webpack_require__(48);
	module.exports = __webpack_require__(44) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(41)
	  , IE8_DOM_DEFINE = __webpack_require__(43)
	  , toPrimitive    = __webpack_require__(47)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(44) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(42);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(44) && !__webpack_require__(45)(function(){
	  return Object.defineProperty(__webpack_require__(46)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(45)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(42)
	  , document = __webpack_require__(32).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(42);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	module.exports = __webpack_require__(36).Object.assign;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(35);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(52)});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(53)
	  , gOPS     = __webpack_require__(63)
	  , pIE      = __webpack_require__(64)
	  , toObject = __webpack_require__(26)
	  , IObject  = __webpack_require__(56)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(45)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(54)
	  , enumBugKeys = __webpack_require__(62);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(29)
	  , toIObject    = __webpack_require__(55)
	  , arrayIndexOf = __webpack_require__(58)(false)
	  , IE_PROTO     = __webpack_require__(30)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(56)
	  , defined = __webpack_require__(27);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(57);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(55)
	  , toLength  = __webpack_require__(59)
	  , toIndex   = __webpack_require__(61);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(60)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 60 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(60)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 63 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 64 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 65 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(67);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(68);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(87);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(69), __esModule: true };

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(70);
	__webpack_require__(82);
	module.exports = __webpack_require__(86).f('iterator');

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(71)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(72)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(60)
	  , defined   = __webpack_require__(27);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(73)
	  , $export        = __webpack_require__(35)
	  , redefine       = __webpack_require__(74)
	  , hide           = __webpack_require__(39)
	  , has            = __webpack_require__(29)
	  , Iterators      = __webpack_require__(75)
	  , $iterCreate    = __webpack_require__(76)
	  , setToStringTag = __webpack_require__(80)
	  , getPrototypeOf = __webpack_require__(28)
	  , ITERATOR       = __webpack_require__(81)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(39);

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(77)
	  , descriptor     = __webpack_require__(48)
	  , setToStringTag = __webpack_require__(80)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(39)(IteratorPrototype, __webpack_require__(81)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(41)
	  , dPs         = __webpack_require__(78)
	  , enumBugKeys = __webpack_require__(62)
	  , IE_PROTO    = __webpack_require__(30)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(46)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(79).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(40)
	  , anObject = __webpack_require__(41)
	  , getKeys  = __webpack_require__(53);
	
	module.exports = __webpack_require__(44) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(32).document && document.documentElement;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(40).f
	  , has = __webpack_require__(29)
	  , TAG = __webpack_require__(81)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(31)('wks')
	  , uid        = __webpack_require__(33)
	  , Symbol     = __webpack_require__(32).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83);
	var global        = __webpack_require__(32)
	  , hide          = __webpack_require__(39)
	  , Iterators     = __webpack_require__(75)
	  , TO_STRING_TAG = __webpack_require__(81)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(84)
	  , step             = __webpack_require__(85)
	  , Iterators        = __webpack_require__(75)
	  , toIObject        = __webpack_require__(55);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(72)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(81);

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(89);
	__webpack_require__(98);
	__webpack_require__(99);
	__webpack_require__(100);
	module.exports = __webpack_require__(36).Symbol;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(32)
	  , has            = __webpack_require__(29)
	  , DESCRIPTORS    = __webpack_require__(44)
	  , $export        = __webpack_require__(35)
	  , redefine       = __webpack_require__(74)
	  , META           = __webpack_require__(90).KEY
	  , $fails         = __webpack_require__(45)
	  , shared         = __webpack_require__(31)
	  , setToStringTag = __webpack_require__(80)
	  , uid            = __webpack_require__(33)
	  , wks            = __webpack_require__(81)
	  , wksExt         = __webpack_require__(86)
	  , wksDefine      = __webpack_require__(91)
	  , keyOf          = __webpack_require__(92)
	  , enumKeys       = __webpack_require__(93)
	  , isArray        = __webpack_require__(94)
	  , anObject       = __webpack_require__(41)
	  , toIObject      = __webpack_require__(55)
	  , toPrimitive    = __webpack_require__(47)
	  , createDesc     = __webpack_require__(48)
	  , _create        = __webpack_require__(77)
	  , gOPNExt        = __webpack_require__(95)
	  , $GOPD          = __webpack_require__(97)
	  , $DP            = __webpack_require__(40)
	  , $keys          = __webpack_require__(53)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(96).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(64).f  = $propertyIsEnumerable;
	  __webpack_require__(63).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(73)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(39)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(33)('meta')
	  , isObject = __webpack_require__(42)
	  , has      = __webpack_require__(29)
	  , setDesc  = __webpack_require__(40).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(45)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(32)
	  , core           = __webpack_require__(36)
	  , LIBRARY        = __webpack_require__(73)
	  , wksExt         = __webpack_require__(86)
	  , defineProperty = __webpack_require__(40).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(53)
	  , toIObject = __webpack_require__(55);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(53)
	  , gOPS    = __webpack_require__(63)
	  , pIE     = __webpack_require__(64);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(57);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(55)
	  , gOPN      = __webpack_require__(96).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(54)
	  , hiddenKeys = __webpack_require__(62).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(64)
	  , createDesc     = __webpack_require__(48)
	  , toIObject      = __webpack_require__(55)
	  , toPrimitive    = __webpack_require__(47)
	  , has            = __webpack_require__(29)
	  , IE8_DOM_DEFINE = __webpack_require__(43)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(44) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 98 */
/***/ function(module, exports) {



/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(91)('asyncIterator');

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(91)('observable');

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(102);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(104);
	var $Object = __webpack_require__(36).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(35);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(44), 'Object', {defineProperty: __webpack_require__(40).f});

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(106);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(110);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(67);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(107), __esModule: true };

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(108);
	module.exports = __webpack_require__(36).Object.setPrototypeOf;

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(35);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(109).set});

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(42)
	  , anObject = __webpack_require__(41);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(37)(Function.call, __webpack_require__(97).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(111), __esModule: true };

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(112);
	var $Object = __webpack_require__(36).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(35)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(77)});

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getIterator2 = __webpack_require__(114);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _stringify = __webpack_require__(119);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// MiddleWares
	var zAixs = __webpack_require__(121);
	var Temperature = __webpack_require__(122);
	
	var Point = function () {
	  function Point() {
	    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	    (0, _classCallCheck3.default)(this, Point);
	
	    /*
	     * x : x aixs
	     * y : y aixs
	     * z : z aixs
	     * f : feed rate
	     * t : temperature
	     */
	
	    this.type = 'point';
	    this.x = x;
	    this.y = y;
	    this.f = f;
	    this.e = 0;
	    this.z = null;
	    this.t = null;
	  }
	
	  (0, _createClass3.default)(Point, [{
	    key: 'json',
	    get: function get() {
	      return (0, _stringify2.default)(this);
	    }
	  }]);
	  return Point;
	}();
	
	var Command = function () {
	  function Command(command) {
	    (0, _classCallCheck3.default)(this, Command);
	
	    this.type = 'command';
	    this.name = command;
	  }
	
	  (0, _createClass3.default)(Command, [{
	    key: 'json',
	    get: function get() {
	      return (0, _stringify2.default)(this);
	    }
	  }]);
	  return Command;
	}();
	
	var MixCommand = function (_Command) {
	  (0, _inherits3.default)(MixCommand, _Command);
	
	  function MixCommand(temperature) {
	    (0, _classCallCheck3.default)(this, MixCommand);
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (MixCommand.__proto__ || (0, _getPrototypeOf2.default)(MixCommand)).call(this, 'mix'));
	
	    _this.t = temperature;
	    return _this;
	  }
	
	  return MixCommand;
	}(Command);
	
	var CalibrationCommand = function (_Command2) {
	  (0, _inherits3.default)(CalibrationCommand, _Command2);
	
	  function CalibrationCommand() {
	    (0, _classCallCheck3.default)(this, CalibrationCommand);
	    return (0, _possibleConstructorReturn3.default)(this, (CalibrationCommand.__proto__ || (0, _getPrototypeOf2.default)(CalibrationCommand)).call(this, 'calibration'));
	  }
	
	  return CalibrationCommand;
	}(Command);
	
	var HomeCommand = function (_Command3) {
	  (0, _inherits3.default)(HomeCommand, _Command3);
	
	  function HomeCommand() {
	    (0, _classCallCheck3.default)(this, HomeCommand);
	    return (0, _possibleConstructorReturn3.default)(this, (HomeCommand.__proto__ || (0, _getPrototypeOf2.default)(HomeCommand)).call(this, 'home'));
	  }
	
	  return HomeCommand;
	}(Command);
	
	var WaitCommand = function (_Command4) {
	  (0, _inherits3.default)(WaitCommand, _Command4);
	
	  function WaitCommand(second) {
	    (0, _classCallCheck3.default)(this, WaitCommand);
	
	    var _this4 = (0, _possibleConstructorReturn3.default)(this, (WaitCommand.__proto__ || (0, _getPrototypeOf2.default)(WaitCommand)).call(this, 'wait'));
	
	    _this4.time = second;
	    return _this4;
	  }
	
	  return WaitCommand;
	}(Command);
	
	var Process = function () {
	  function Process(params) {
	    (0, _classCallCheck3.default)(this, Process);
	
	    this.middleWares = [zAixs, Temperature];
	    this.params = params;
	  }
	
	  (0, _createClass3.default)(Process, [{
	    key: 'registerMiddleWare',
	    value: function registerMiddleWare(middleWare) {
	      this.middleWares.push(middleWare);
	    }
	  }, {
	    key: 'radians',
	    value: function radians(degress) {
	      return degress * Math.PI / 180;
	    }
	  }, {
	    key: 'post_action',
	    value: function post_action(points) {
	      return points;
	    }
	  }, {
	    key: 'time',
	    get: function get() {
	      return undefined;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return undefined;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return undefined;
	    }
	  }, {
	    key: '_points',
	    get: function get() {
	      return [];
	    }
	  }, {
	    key: 'points',
	    get: function get() {
	      var points = this._points;
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = (0, _getIterator3.default)(this.middleWares), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var middleWare = _step.value;
	
	          points = middleWare(points, this.params);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      points = this.post_action(points);
	
	      return points;
	    }
	  }]);
	  return Process;
	}();
	
	module.exports = {
	  Point: Point,
	  Process: Process,
	  WaitCommand: WaitCommand,
	  HomeCommand: HomeCommand,
	  MixCommand: MixCommand,
	  CalibrationCommand: CalibrationCommand
	};

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(115), __esModule: true };

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(82);
	__webpack_require__(70);
	module.exports = __webpack_require__(116);

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(41)
	  , get      = __webpack_require__(117);
	module.exports = __webpack_require__(36).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(118)
	  , ITERATOR  = __webpack_require__(81)('iterator')
	  , Iterators = __webpack_require__(75);
	module.exports = __webpack_require__(36).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(57)
	  , TAG = __webpack_require__(81)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(36)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	'use strict';
	
	function zAixs(points, params) {
	
	  if (params.high === undefined) {
	    return points;
	  }
	
	  if (params.name === 'fixed_point') {
	    return points;
	  }
	
	  var startH = params.high.start;
	  var endH = params.high.end !== undefined ? params.high.end : startH;
	  var diffH = endH - startH;
	
	  for (var i = 0; i < points.length; i++) {
	    points[i].z = startH + diffH / points.length * i;
	  }
	
	  return points;
	}
	
	module.exports = zAixs;

/***/ },
/* 122 */
/***/ function(module, exports) {

	"use strict";
	
	function temperature(points, params) {
	
	  if (params.temperature === undefined) {
	    return points;
	  }
	
	  for (var i = 0; i < points.length; i++) {
	    points[i].t = params.temperature;
	  }
	
	  return points;
	}
	
	module.exports = temperature;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var Point = Base.Point;
	
	var QUICK_MOVE_F = 5000;
	
	var FixedPoint = function (_Base$Process) {
	  (0, _inherits3.default)(FixedPoint, _Base$Process);
	  (0, _createClass3.default)(FixedPoint, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'process',
	        name: 'fixed_point',
	        coordinates: {
	          x: 0, // mm
	          y: 0 },
	        high: {
	          start: 300, // mm
	          end: 300
	        },
	        total_water: 100, // mm
	        point_interval: 1.0, // mm
	        feedrate: 80, // mm
	        extrudate: 0.2, // ml/mm
	        temperature: 60 });
	    }
	  }]);
	
	  function FixedPoint(params) {
	    (0, _classCallCheck3.default)(this, FixedPoint);
	
	    params = params || FixedPoint.default;
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (FixedPoint.__proto__ || (0, _getPrototypeOf2.default)(FixedPoint)).call(this, params));
	
	    _this.point_number = _this.length / _this.params.point_interval;
	    return _this;
	  }
	
	  (0, _createClass3.default)(FixedPoint, [{
	    key: 'post_action',
	    value: function post_action(points) {
	      points[0].e = 0;
	
	      return points;
	    }
	  }, {
	    key: 'time',
	    get: function get() {
	      return this.params.total_water / this.params.extrudate / this.params.feedrate * 60;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return this.params.total_water;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return this.params.total_water / this.params.extrudate;
	    }
	  }, {
	    key: '_points',
	    get: function get() {
	      var x = this.params.coordinates.x;
	      var y = this.params.coordinates.y;
	
	      var points = [];
	
	      // Quick move to the start point.
	      var move = new Point(x, y, QUICK_MOVE_F);
	      points.push(move);
	
	      for (var i = 0; i < this.length; i++) {
	        var p = new Point(null, null, this.params.extrudate);
	        p.e = this.water / this.length;
	        p.f = this.params.feedrate;
	        points.push(p);
	      }
	
	      return points;
	    }
	  }]);
	  return FixedPoint;
	}(Base.Process);
	
	module.exports = FixedPoint;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var Point = Base.Point;
	
	var Spiral = function (_Base$Process) {
	  (0, _inherits3.default)(Spiral, _Base$Process);
	  (0, _createClass3.default)(Spiral, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'process',
	        name: 'spiral',
	        radius: {
	          start: 10, // mm
	          end: 20 },
	        high: {
	          start: 300, // mm
	          end: 300
	        },
	        cylinder: 5,
	        point_interval: 2.0, // mm
	        feedrate: 80, // mm
	        extrudate: 0.2, // ml/mm
	        temperature: 60 });
	    }
	  }]);
	
	  function Spiral(params) {
	    (0, _classCallCheck3.default)(this, Spiral);
	
	    params = params || Spiral.default;
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (Spiral.__proto__ || (0, _getPrototypeOf2.default)(Spiral)).call(this, params));
	
	    _this.created_points = _this.generatePoints();
	    return _this;
	  }
	
	  (0, _createClass3.default)(Spiral, [{
	    key: 'generatePoints',
	    value: function generatePoints() {
	      var maxTheta = this.radians(this.params.cylinder * 360);
	      // a is acceleration
	      var a = (this.params.radius.end - this.params.radius.start) / maxTheta;
	
	      var totalTheta = 0;
	      var points = [];
	
	      var e = this.params.extrudate;
	      while (totalTheta <= maxTheta) {
	        // point interval / (2 * pi * r) = theta for one step
	        var nowRadius = a * totalTheta + this.params.radius.start;
	        var nowTheta = this.radians(this.params.point_interval / (2 * Math.PI * nowRadius) * 360);
	
	        totalTheta = totalTheta + nowTheta;
	
	        var x = nowRadius * Math.cos(totalTheta);
	        var y = nowRadius * Math.sin(totalTheta);
	
	        var p = new Point(x, y, this.params.feedrate);
	        p.e = e;
	        // Create the point object to save the information
	        points.push(p);
	      }
	      return points;
	    }
	  }, {
	    key: 'time',
	    get: function get() {
	      return this.length / this.params.feedrate * 60;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return this.created_points.length * this.params.extrudate;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return this.created_points.length * this.params.point_interval;
	    }
	  }, {
	    key: '_points',
	    get: function get() {
	      return this.created_points;
	    }
	  }]);
	  return Spiral;
	}(Base.Process);
	
	module.exports = Spiral;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getIterator2 = __webpack_require__(114);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	
	var SpiralTotalWater = function (_Base$Process) {
	  (0, _inherits3.default)(SpiralTotalWater, _Base$Process);
	  (0, _createClass3.default)(SpiralTotalWater, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'process',
	        name: 'spiral total water',
	        radius: {
	          start: 10, // mm
	          end: 20 },
	        high: {
	          start: 300, // mm
	          end: 300
	        },
	        cylinder: 5,
	        point_interval: 2.0, // mm
	        total_water: 60, // ml
	        total_time: 30, // sec
	        temperature: 60 });
	    }
	  }]);
	
	  function SpiralTotalWater(params) {
	    (0, _classCallCheck3.default)(this, SpiralTotalWater);
	
	    params = params || SpiralTotalWater.default;
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (SpiralTotalWater.__proto__ || (0, _getPrototypeOf2.default)(SpiralTotalWater)).call(this, params));
	
	    _this.created_points = _this.generatePoints();
	    return _this;
	  }
	
	  (0, _createClass3.default)(SpiralTotalWater, [{
	    key: 'generatePoints',
	    value: function generatePoints() {
	      var maxTheta = this.radians(this.params.cylinder * 360);
	      // a is acceleration
	      var a = (this.params.radius.end - this.params.radius.start) / maxTheta;
	
	      var totalTheta = 0;
	      var points = [];
	
	      while (totalTheta <= maxTheta) {
	        // point interval / (2 * pi * r) = theta for one step
	        var nowRadius = a * totalTheta + this.params.radius.start;
	        var nowTheta = this.radians(this.params.point_interval / (2 * Math.PI * nowRadius) * 360);
	
	        totalTheta = totalTheta + nowTheta;
	
	        var x = nowRadius * Math.cos(totalTheta);
	        var y = nowRadius * Math.sin(totalTheta);
	
	        // Create the point object to save the information
	        points.push(new Base.Point(x, y));
	      }
	
	      // f
	      var totalLen = this.params.point_interval * (points.length - 1);
	      var f = totalLen * 60 / this.params.total_time;
	      var e = this.water / points.length;
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = (0, _getIterator3.default)(points), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var point = _step.value;
	
	          point.f = f;
	          point.e = e;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return points;
	    }
	  }, {
	    key: 'time',
	    get: function get() {
	      return this.params.total_time;
	    },
	    set: function set(sec) {
	      this.params.total_time = sec;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return this.params.total_water;
	    },
	    set: function set(ml) {
	      this.params.total_water = ml;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return this.params.point_interval * (this.created_points.length - 1);
	    }
	  }, {
	    key: '_points',
	    get: function get() {
	      return this.created_points;
	    }
	  }]);
	  return SpiralTotalWater;
	}(Base.Process);
	
	module.exports = SpiralTotalWater;

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var WaitCommand = Base.WaitCommand;
	
	var Wait = function (_Base$Process) {
	  (0, _inherits3.default)(Wait, _Base$Process);
	  (0, _createClass3.default)(Wait, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'command',
	        name: 'wait',
	        total_time: 30
	      });
	    }
	  }]);
	
	  function Wait() {
	    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Wait.default;
	    (0, _classCallCheck3.default)(this, Wait);
	    return (0, _possibleConstructorReturn3.default)(this, (Wait.__proto__ || (0, _getPrototypeOf2.default)(Wait)).call(this, params));
	  }
	
	  (0, _createClass3.default)(Wait, [{
	    key: 'time',
	    get: function get() {
	      return this.params.total_time;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'points',
	    get: function get() {
	      return [new WaitCommand(this.params.total_time)];
	    }
	  }]);
	  return Wait;
	}(Base.Process);
	
	module.exports = Wait;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var HomeCommand = Base.HomeCommand;
	
	var Home = function (_Base$Process) {
	  (0, _inherits3.default)(Home, _Base$Process);
	  (0, _createClass3.default)(Home, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'command',
	        name: 'home'
	      });
	    }
	  }]);
	
	  function Home(params) {
	    (0, _classCallCheck3.default)(this, Home);
	
	    params = params || Home.default;
	    return (0, _possibleConstructorReturn3.default)(this, (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).call(this, params));
	  }
	
	  (0, _createClass3.default)(Home, [{
	    key: 'time',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'points',
	    get: function get() {
	      return [new HomeCommand()];
	    }
	  }]);
	  return Home;
	}(Base.Process);
	
	module.exports = Home;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var Point = Base.Point;
	
	var QUICK_MOVE_F = 5000;
	
	var Move = function (_Base$Process) {
	  (0, _inherits3.default)(Move, _Base$Process);
	  (0, _createClass3.default)(Move, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'process',
	        name: 'move',
	        coordinates: {
	          x: 0,
	          y: 0
	        },
	        high: {
	          start: 300
	        }
	      });
	    }
	  }]);
	
	  function Move(params) {
	    (0, _classCallCheck3.default)(this, Move);
	
	    params = params || Move.default;
	    return (0, _possibleConstructorReturn3.default)(this, (Move.__proto__ || (0, _getPrototypeOf2.default)(Move)).call(this, params));
	  }
	
	  (0, _createClass3.default)(Move, [{
	    key: 'time',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return 1;
	    }
	  }, {
	    key: '_points',
	    get: function get() {
	      var x = this.params.coordinates.x;
	      var y = this.params.coordinates.y;
	
	      var points = [];
	
	      // Quick move to the start point.
	      var move = new Point(x, y, QUICK_MOVE_F);
	      points.push(move);
	
	      return points;
	    }
	  }]);
	  return Move;
	}(Base.Process);
	
	module.exports = Move;

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var CalibrationCommand = Base.CalibrationCommand;
	
	var Calibration = function (_Base$Process) {
	  (0, _inherits3.default)(Calibration, _Base$Process);
	  (0, _createClass3.default)(Calibration, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'command',
	        name: 'calibration'
	      });
	    }
	  }]);
	
	  function Calibration(params) {
	    (0, _classCallCheck3.default)(this, Calibration);
	
	    params = params || Calibration.default;
	    return (0, _possibleConstructorReturn3.default)(this, (Calibration.__proto__ || (0, _getPrototypeOf2.default)(Calibration)).call(this, params));
	  }
	
	  (0, _createClass3.default)(Calibration, [{
	    key: 'time',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'points',
	    get: function get() {
	      return [new CalibrationCommand()];
	    }
	  }]);
	  return Calibration;
	}(Base.Process);
	
	module.exports = Calibration;

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _getPrototypeOf = __webpack_require__(23);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _assign = __webpack_require__(49);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _classCallCheck2 = __webpack_require__(65);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _possibleConstructorReturn2 = __webpack_require__(66);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _createClass2 = __webpack_require__(101);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _inherits2 = __webpack_require__(105);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Base = __webpack_require__(113);
	var MixCommand = Base.MixCommand;
	
	var QUICK_MOVE_F = 5000;
	
	var Mix = function (_Base$Process) {
	  (0, _inherits3.default)(Mix, _Base$Process);
	  (0, _createClass3.default)(Mix, null, [{
	    key: 'default',
	    get: function get() {
	      return (0, _assign2.default)({}, {
	        type: 'command',
	        name: 'mix',
	        temperature: 65
	      });
	    }
	  }]);
	
	  function Mix(params) {
	    (0, _classCallCheck3.default)(this, Mix);
	
	    params = params || Mix.default;
	    return (0, _possibleConstructorReturn3.default)(this, (Mix.__proto__ || (0, _getPrototypeOf2.default)(Mix)).call(this, params));
	  }
	
	  (0, _createClass3.default)(Mix, [{
	    key: 'time',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'water',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'length',
	    get: function get() {
	      return 0;
	    }
	  }, {
	    key: 'points',
	    get: function get() {
	      return [new MixCommand(this.params.temperature), new Base.Point(0, 0, QUICK_MOVE_F)];
	    }
	  }]);
	  return Mix;
	}(Base.Process);
	
	module.exports = Mix;

/***/ },
/* 131 */
/***/ function(module, exports) {

	module.exports = require("inert");

/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = require("vision");

/***/ },
/* 133 */
/***/ function(module, exports) {

	module.exports = require("hapi-swagger");

/***/ }
/******/ ]);
//# sourceMappingURL=backend.js.map