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

    }
}
