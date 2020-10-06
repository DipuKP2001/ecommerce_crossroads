const mongoClient = require('mongodb').MongoClient
const state = {
    db:null
}
module.exports.connect = function(done){
    const url = 'mongodb+srv://dipzz234:dNjtyFBEHNJ4GU98@cluster0.hf3fo.mongodb.net/shopping?retryWrites=true&w=majority'
    const dbname='shopping'

    mongoClient.connect(url,{ useUnifiedTopology: true },(err,data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)
        done() 
    })

} 

module.exports.get = function(){
    return state.db
}