const collection = require('../config/collection')
var db = require('../config/connection')
const bcrypt = require('bcrypt')
const { use } = require('../routes')

module.exports = {
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            try {  
                userData.Password = await bcrypt.hash(userData.Password,10)
            } catch (err) {
                console.log(err);
            }
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            }).catch((err) => { 
                reject(err,'Error occured') 
            });
        }) 
    }, 
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status) {
                        response.user = user
                        response.status = true 
                        resolve(response)
                    }
                    else console.log('login failed')
                    resolve({status:false})
                }) 
            }
            else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    }
}