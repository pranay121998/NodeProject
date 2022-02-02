const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect=(callback)=>{
    MongoClient.connect("mongodb+srv://Pranay:lDRSNjUdwmle0CSj@cluster0.1vdgw.mongodb.net/nodeProject?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }).
    then(client=>{
        console.log("Connected");
        _db = client.db();
        callback();
    }).catch(err=>console.log(err))
}

const getDb=()=>{
    if(_db){
        return _db;
    }
    throw "No database found!"
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;