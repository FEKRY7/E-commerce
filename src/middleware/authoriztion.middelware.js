const http = require('../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../utils/httperespons')

const isAuthorized = (...roles)=>{
    return (req , res , next)=>{
        if (!roles.includes(req.user.role))
        return Firest(res,"not authorized user",403,http.FAIL)
        
        return next()
    }
}

module.exports = isAuthorized