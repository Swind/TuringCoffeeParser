const Nedb = require('nedb')

class CookbookMgr {
    constructor(dbname, inMemoryOnly=false) {
      this.db = new Nedb({
        filename: dbname,
        autoload: true,
        inMemoryOnly: inMemoryOnly
      });
    }

    list(callback){
      this.db.find({}, (err, docs)=>{
        callback(err, docs);
      });
    }

    create(data, callback){
      this.db.insert(data, (err, doc) => {
        callback(err, doc);
      });
    }

    update(id, data, callback){
      this.db.update({_id: id}, data, (err, numReplaced) => {
        callback(err, numReplaced);
      });
    }

    read(id, callback){
      this.db.findOne({_id: id}, (err, doc) => {
        callback(err, doc);
      });
    }

    delete(id, callback) {
      this.db.remove({_id: id}, (err, numRemoved)=>{
        callback(err, numRemoved);
      });
    }
}

module.exports = CookbookMgr 
