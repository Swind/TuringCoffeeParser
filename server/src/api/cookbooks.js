var Joi = require('joi');
var Cookbooks = require('../models/cookbooks');
var API = require('./api');

class CookbooksAPI extends API{
    constructor(manager) {
      super();
      this.manager = manager;
    }

    /*
     * List all cookbooks
     */
    list_spec(){
      return {
        method: 'GET',
        path: '/api/cookbooks',
        config: {
          tags: ['api'],
          description: 'List all cookbooks',
          notes: 'List all cookbooks'
        },
        handler: this.list.bind(this)
      }
    }

    list(request, reply){
      this.manager.list((err, cookbooks)=>{
        if(err) {
          this.failed(reply, 503, err);
        }
        else {
          this.successed(reply, 200, 'List all cookbooks successfully', cookbooks);
        }
      });
    }

    /*
     * Create a cookbook 
     */
    create_spec(){
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
              content: Joi.object()
            }
          }
        },
        handler: this.create.bind(this)
      }
    }

    create(request, reply){
      this.manager.create(request.payload, (err, doc) => {
        if(err){
          this.failed(reply, 503, err);
        }
        else {
          this.successed(reply, 201, 'Create the cookbook successfully', doc);
        }
      });
    }

    /*
     * Update a cookbook 
     */
    update_spec(){
      return {
        method: 'PUT',
        path: '/api/cookbooks/{id}',
        config: {
          tags: ['api'],
          description: 'Update the cookbook',
          notes: 'Update the cookbook',
          validate: {
            params: {
              id: Joi.string().required()
            },
            payload: {
              name: Joi.string().required(),
              description: Joi.string(),
              content: Joi.object(),
            }
          }
        },
        handler: this.update.bind(this)
      }
    }

    update(request, reply){
      let id = request.params.id;

      this.manager.update(id, request.payload, (err, numReplaced) =>{
        if(err){
          this.failed(reply, 503, err);
        }
        else if (numReplaced == 0){
          this.failed(reply, 404, `Can't find the cookbook with id ${id}`);
        }
        else {
          this.successed(`Update cookbook ${id} successfully`);
        }
      });
    }

    /*
     * Read a cookbook 
     */
    read_spec(){
      return  {
        method: 'GET',
        path: '/api/cookbooks/{id}',
        config: {
          tags: ['api'],
          description: 'Read the cookbook',
          notes: 'Read the cookbook',
          validate: {
            params: {
              id: Joi.string().required()
            }
          }
        },
        handler: this.read.bind(this)
      }
    }

    read(request, reply){
      let id = request.params.id;

      this.manager.read(request.params.id, (err, cookbook)=>{
        if(err) {
          this.failed(reply, 503, err);
        }
        else if(!cookbook) {
          this.failed(reply, 404, `Can't find cookbook with id ${id}`);
        }
        else {
          this.successed(reply, 200, cookbook);
        }
      });
    }

    /*
     * Delete a cookbook 
     */
    delete_spec(){
      return {
        method: 'DELETE',
        path: '/api/cookbooks/{id}',
        config: {
          tags: ['api'],
          description: 'Delete the cookbook',
          notes: 'Delete the cookbook',
          validate: {
            params: {
              id: Joi.string().required()
            }
          }
        },
        handler: this.delete.bind(this) 
      }
    }

    delete(request, reply){
      let id = request.params.id;
      this.manager.delete(id, (err, numRemoved)=>{
        if(err){
          this.failed(reply, 503, err);
        }
        else if(numRemoved == 0){
          this.failed(reply, 404, `Can't delete cookbook with id ${id}`);
        }
        else {
          this.successed(reply, 204, 'Delete cookbook successfully');
        }
      }); 
    }

    api_specs(){
      return [
        this.list_spec(), 
        this.create_spec(),
        this.read_spec(),
        this.update_spec(),
        this.delete_spec(),
      ]
    }
};

module.exports = CookbooksAPI
