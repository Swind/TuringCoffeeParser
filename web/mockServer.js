'use strict';

const Hapi = require('hapi')
const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3002
})

server.route({
  method: 'GET',
  path: '/api/cookbooks',
  handler: function (request, reply) {
    var res = {
      statusCode: 200,
      message: "List all cookbooks successfully",
      data: [
        {
          _id: 1,
          name: "Three cups"
        },
        {
          _id: 2,
          name: "Two cups"
        }
      ]
    }

    return reply(res)
  }
});

server.route(
  {
    method: 'GET',
    path: '/api/cookbooks/{id}',
    handler: function (request, reply) {
      return reply({
        statusCode: 200,
        message: "Get cookbook successfully",
        data: {
          name: "Three cups",
          description: "Three cups with filter",
          processes: [
            {
              type: 'process',
              name: 'spiral',
              description: 'spiral test process',
              radius: {
                start: 10, //mm
                end: 20 //mm
              },
              high: {
                start: 170, //mm
                end: 165 //mm
              },
              cylinder: 5,
              point_interval: 0.1, //mm
              feedrate: 80, //mm/min
              extrudate: 0.2, //ml/mm
              temperature: 80
            },
            {
              type: 'process',
              name: 'spiral',
              description: 'spiral test process',
              radius: {
                start: 10, //mm
                end: 20 //mm
              },
              high: {
                start: 170, //mm
                end: 165 //mm
              },
              cylinder: 5,
              point_interval: 0.1, //mm
              feedrate: 80, //mm/min
              extrudate: 0.2, //ml/mm
              temperature: 80
            }
          ]
        }
      })
    }
  }
);

server.route(
  {
    method: 'PUT',
    path: '/api/cookbooks/{id}',
    handler: function (request, reply) {
      return reply({
        statusCode: 200,
        message: "Save cookbook successfully",
      })
    }
  }
);

server.start((err) => {
  if (err) {
    throw err
  }

  console.log('Server running at:', server.info.uri)
});
