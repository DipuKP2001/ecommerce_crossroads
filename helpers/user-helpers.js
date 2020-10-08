const collection = require('../config/collection')
var db = require('../config/connection')
const bcrypt = require('bcrypt')
const { use } = require('../routes')
const { response } = require('express')
const objectId = require('mongodb').ObjectId

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
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(!userCart){
                let cartObj = {
                    user:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }else{
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},{
                    $push:{products:objectId(proId)}
                }).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{proList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id','$$proList']
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray() 
            resolve(cartItems[0].cartItems) 
        })
    }
}