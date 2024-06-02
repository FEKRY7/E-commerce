const slugify = require('slugify')
const categoryModel = require('../../../Database/models/category.model.js')
const subCategoryModel = require('../../../Database/models/subCategory.model.js')
const cloudinary  = require('../../utils/cloud.js')
const http = require('../../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../../utils/httperespons.js')



const addSubcategory = async(req,res)=>{
try{
        // check for category
        const category = await categoryModel.findById(req.params.categoryId)
        if(!category){
            return Firest(res,"Category is not found ",400,http.FAIL)
        } 
            
        // check for the file
        if(!req.file){
            return Firest(res,"Subcategory Image is required",400,http.FAIL)
        } 
        const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.CLOUD_FOLDER_NAME}/Subcategory`})
        // creation of subcategory
        await subCategoryModel.create({
           name:req.body.name,
           slug:slugify(req.body.name),
           createdBy:req.user._id,
           image:{id:public_id , url:secure_url},
           Category: req.params.categoryId,
        })
    
           Schand(res,"Subcategory added",200,http.SUCCESS)
}catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}
 

const upDateSubcategory = async(req,res)=>{
try{
       
   
    // checking category existince
    const category = await categoryModel.findById(req.body.categoryId)
    if (!category){
        return Firest(res,"Category is not found ",404,http.FAIL)
    } 
    //checking for subcategory and the parent 
     
    const subcategory= await subCategoryModel.findOne({_id:req.params.id , Category:req.body.categoryId})
     
    if(!subcategory){
        return Firest(res,"Subcategory dosent excist",404,http.FAIL)
    } 
    
    // checking subcategory owner (can be modified if theres more that one admin can change the categories)
    if(req.user._id.toString() !== subcategory.createdBy.toString()){
        return Firest(res,"you are not the admin whos created this Subcategory",403,http.FAIL)
    }
    // checking if theres update on the image of the subcategory 
    if(req.file){
       const {public_id , secure_url}= await cloudinary.uploader.upload(req.file.path, {public_id:subcategory.image.id})
       subcategory.image = {id:public_id ,url:secure_url}
    }
    // checking if theres update on subcategory name
    subcategory.name = req.body.name ? req.body.name : subcategory.name
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    // saving updates
    await subcategory.save()

    Schand(res,"subcategory updated",200,http.SUCCESS)
}catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}


const deleteSubcategory = async (req, res) => {
    try {
        // Find category 
        const category = await categoryModel.findOne(req.body.categoryId);
        if (!category) {
            return Firest(res,"Category not found",404,http.FAIL)
        }

        // Find subcategory and the parent category
        const subcategory = await subCategoryModel.findOne({ _id: req.params.id });
        if (!subcategory) {
            return Firest(res,"Subcategory not found",404,http.FAIL)
        }

        // Check the creator of the subcategory
        if (req.user._id.toString() !== subcategory.createdBy.toString()) {
            return Firest(res,"You are not the admin who created this Subcategory",403,http.FAIL)
        }

        // Delete the subcategory
        await subcategory.deleteOne();

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(subcategory.image.id);

        return Schand(res,"Subcategory Deleted",200,http.SUCCESS)
    
    }catch (error) {
        console.error(error);
        return Thered(res, 'Internal Server Error', 500, http.ERROR);    
    }
};



const AllSubcategories = async(req,res)=>{
try{
    // if theres category id 
    if(req.params.categoryId){
        const results = await subCategoryModel.find({Category:req.params.categoryId})
        
        return Schand(res,results,200,http.SUCCESS)
    }
    // if theres not  category id
    const results= await subCategoryModel.find().populate([{path:'createdBy',select:"name -_id"},
    {path:"Category",select:"name -_id"}])

    return Schand(res,results,200,http.SUCCESS)

}catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}

module.exports = {
    addSubcategory,
    upDateSubcategory,
    deleteSubcategory,
    AllSubcategories
}