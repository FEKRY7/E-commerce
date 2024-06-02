const slugify = require('slugify')
const categoryModel = require('../../../Database/models/category.model.js')
const cloudinary  = require('../../utils/cloud.js') 
const http = require('../../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../../utils/httperespons.js')
 


const addCategory = async(req,res)=>{
try{
   if(!req.file){
      return Firest(res,"category Image is required",400,http.FAIL)
     } 
     const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/category`})
     await categoryModel.create({
        name:req.body.name,
        slug:slugify(req.body.name),
        createdBy:req.user._id,
        image:{id:public_id , url:secure_url}
     })
      Schand(res,"Category added",200,http.SUCCESS)
}catch (error) {
   console.error(error);
   return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}

 
const upDateCategory = async(req,res)=>{
try{
   
   // checking category existince
   const category = await categoryModel.findById(req.params.id)
   
   if (!category){
    return Firest(res,"Category is not found ",404,http.FAIL)
   } 
   
   // checking category owner (can be modified if theres more that one admin can change the categories)
   if(req.user._id.toString() !== category.createdBy.toString()){
      return Firest(res,"you are not the admin whos created this category",403,http.FAIL)
   }
   // checking if theres update on the image of the cateogry 
   if(req.file){
      const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path, {public_id:category.image.id})
      category.image = {id:public_id ,url:secure_url}
   }
   // checking if theres update on category name
   category.name = req.body.name ? req.body.name : category.name
   category.slug = req.body.name ? slugify(req.body.name) : category.slug
   // saving updates
   await category.save()
   Schand(res,"category updated",200,http.SUCCESS)
}catch (error) {
   console.error(error);
   return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}   
}



const deleteCategory = async(req,res)=>{
try{
   // find category 
   const category = await categoryModel.findById(req.params.id)
   if(!category){
      return Firest(res,"Category not found",404,http.FAIL)
   }
    await category.deleteOne()
   // delete image from cloudiniry
   await cloudinary.uploader.destroy(category.image.id)
   Schand(res,"Category Deleted",200,http.SUCCESS)
}catch (error) {
   console.error(error);
   return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}


const getAllCategories = async(req,res)=>{
try{
   const results = await categoryModel.find().populate("subCategory")
   Schand(res,results,200,http.SUCCESS)
}catch (error) {
   console.error(error);
   return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}

module.exports = {
    addCategory,
    upDateCategory,
    deleteCategory,
    getAllCategories
}