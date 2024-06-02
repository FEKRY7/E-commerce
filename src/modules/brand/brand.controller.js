const categoryModel = require('../../../Database/models/category.model.js')
const brandModel = require('../../../Database/models/brand.model.js')
const cloudinary  = require('../../utils/cloud.js')
const slugify = require('slugify')
const http = require('../../folderS,F,E/S,F,E.JS')
const {Firest,Schand,Thered} = require('../../utils/httperespons.js')

const createBrand = async(req,res)=>{
try{

    // check categories 
    const {categoryId , name} = req.body
    
        const isExist = await categoryModel.findById(categoryId)
        if(!isExist){
            return Firest(res,`Category ${categoryId} is not found`,404,http.FAIL)
        }
    
    
    if(!req.file){
        return Firest(res,'Brand image is required',400,http.FAIL)
    }

    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder:`${process.env.CLOUD_FOLDER_NAME}/Brands`})

    const brand = await brandModel.create({
        name,
        createdBy:req.user._id,
        slug:slugify(name),
        logo:{url:secure_url , id:public_id}
    })
    console.log(brandModel)
    
        await categoryModel.findByIdAndUpdate(categoryId , {
            $push:{brands: brand._id}
        })
    

    return Schand(res,"Brand Added",200,http.SUCCESS)

}catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}


const updateBrand = async (req, res) => {
    try {
        // Check for brand 
        const brand = await brandModel.findById(req.params.id);
        if (!brand) {
            return Firest(res,"Brand doesn't exist",404,http.FAIL)
        } 

        // Check if there is a file
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path);
            brand.logo = { url: secure_url, id: public_id };
        }

        // Update brand properties
        brand.name = req.body.name ? req.body.name : brand.name;
        brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

        // Save the updated brand
        await brand.save();

        return Schand(res,"Brand updated",200,http.SUCCESS)

    } catch (error) {
        console.error(error);
        return Thered(res, 'Internal Server Error', 500, http.ERROR);    
     }
};



const deleteBrand = async(req,res)=>{
try{

//Deleteing brand
const brand = await brandModel.findByIdAndDelete(req.params.id)
if(!brand){
    return Firest(res,"Brand id not found",404,http.FAIL)
} 

//delete the image from cloudinary
await cloudinary.uploader.destroy(brand.logo.id)
// find the category that cotains this brand id
await categoryModel.updateMany({},{$pull:{brands:brand._id}})

Schand(res,"Brand id deleted",200,http.SUCCESS)

}catch (error) {
    console.error(error);
    return Thered(res, 'Internal Server Error', 500, http.ERROR);    
}
}


const getBrands = async (req, res) => {
    try {
        // Retrieve all brands from the database
        const brands = await brandModel.find();

        // Send the brands as a response
        return Schand(res,brands,200,http.SUCCESS)

    } catch (error) {
        console.error(error);
        return Thered(res, 'Internal Server Error', 500, http.ERROR);    
    }
};



module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrands
}