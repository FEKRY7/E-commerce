const jwt =  require('jsonwebtoken')
const tokenModel = require('./../../Database/models/tokenModel.js') 
const userModel = require('./../../Database/models/user.model.js') 
const http = require('../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../utils/httperespons')

const isAuthenticated = async(req,res,next)=>{
// checking token existeince
    const token = req.headers.token
    
    if(!token){
        return Firest(res,"token is required",400,http.FAIL)
    }
        
// checking token vlaidation
    const tokenDb=await tokenModel.findOne({token , isValied:true })
    if (!tokenDb) {
        return Firest(res,"expired Token",400,http.FAIL)
    }
        
    
// checkeing user vlaidateion
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await userModel.findById(payload.id)
    if (!user){
        return Firest(res,"user not found",400,http.FAIL)
    } 

    req.user = user 
     
    next()
    
}

module.exports = isAuthenticated