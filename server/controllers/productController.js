import { v2 as cloudinary } from "cloudinary"
import Product from "../models/product.js"

//Add Product:/api/product/add
export const addProduct = async (req, res) => {
    try {
        console.log('Request received:', req.body);
        console.log('Files received:', req.files?.length);

        // Check if files exist
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No images provided" });
        }

        // Parse product data
        let productData;
        try {
            productData = JSON.parse(req.body.productData);
        } catch (parseError) {
            return res.status(400).json({ success: false, message: "Invalid product data format" });
        }

        // Validate required fields
        const requiredFields = ['name', 'description', 'category', 'price', 'offerPrice'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                return res.status(400).json({ success: false, message: `${field} is required` });
            }
        }

        // Validate price values
        if (productData.price < 0 || productData.offerPrice < 0) {
            return res.status(400).json({ success: false, message: "Price must be positive" });
        }

        const images = req.files;
        
        // Upload images to Cloudinary
        let imagesUrl = [];
        try {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    const result = await cloudinary.uploader.upload(item.path, { 
                        resource_type: 'image',
                        folder: 'greencart/products'
                    });
                    return result.secure_url;
                })
            );
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(500).json({ success: false, message: "Failed to upload images" });
        }

        // Create product
        const newProduct = await Product.create({
            ...productData,
            image: imagesUrl,
            inStock: true
        });

        console.log('Product created successfully:', newProduct._id);
        return res.json({ success: true, message: "Product Added Successfully", product: newProduct });

    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error" 
        });
    }
}

//Get Product:/api/product/list
export const productList=async(req,res)=>{
  try{
      const products=await Product.find({})
     return res.json({success:true,products})
  }catch(error){
console.log(error.message);
       res.json({success:false,message:error.message})
  }
}

//Get single product:/api/product/id
export const productById=async(req,res)=>{
   try{
     const {id}=req.body
     const product=await Product.findById(id)
     return res.json({success:true,product})
   }catch(error){
console.log(error.message);
       res.json({success:false,message:error.message})
   }

}

//Change product inStock:/api/product/stock
export const changeStock=async(req,res)=>{
 try{
    const {id ,inStock}=req.body
    await Product.findByIdAndUpdate(id,{inStock})
          return res.json({success:true,message:'Stock Updated'})

 }catch(error){
    console.log(error.message);
       res.json({success:false,message:error.message})
 }
}
