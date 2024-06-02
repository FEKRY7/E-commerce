const Firest = (res,data,statuscod,statustext)=>{
    res.status(statuscod).json({
        "status":statustext,
        "data":data
    })
}
    
const Schand = (res,data,statuscod,statustext)=>{
    res.status(statuscod).json({
        "status":statustext,
        "data": {
            "product":data
        }
    })
}
    
const Thered = (res,masseg,statuscod,statustext)=>{
    res.status(statuscod).json({
        "status":statustext,
        "masseg":masseg
    })
}
    
module.exports={
    Firest,
    Schand,
    Thered
}