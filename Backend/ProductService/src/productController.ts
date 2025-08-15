//Backend/UserService/src/productController.ts
import { Request, Response } from "express";
import productModel from "./productModel";
/*const productList = async (req: Request, res: Response) => {
    try {
        const startIndex = parseInt(req.query.startIndex as string) || 0;
        const limit = parseInt(req.query.limit as string) || 9;
        const sortOrder = req.query.sort === 'asc' ? 1 : -1;
        const query= {};
        if (req.query.src) {
            query.$or = [
                {category: {$regex: req.query.src, $options: "i"}},
                {sub_category: {$regex: req.query.src, $options: "i"}},
                {product_name: {$regex: req.query.src, $options: "i"}}
            ];
        }
        // Price filter
        if (req.query.price && req.query.price.length) {
            const [minPrice, maxPrice] = req.query.price.split('-').map(Number);
            console.log([minPrice, maxPrice])
            query.new_price = {$gte: minPrice, $lte: maxPrice};
        }

        // Handle checkbox filters (brand_name)
        if (req.query.brand && req.query.brand.length > 0) {
            query.brand_name = { $in: req.query.brand.split('--') };
        }
        const products = await productModel.find(query).sort({createdAt: sortOrder}).skip(startIndex).limit(limit);
        const totalProducts = await productModel.countDocuments(query);
        const now = new Date();
        const oneMonthAgo= new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthProducts = await productModel.countDocuments({
            ...query,
            createdAt: { $gte: oneMonthAgo },
        });
        res.json({
            success: true,
            message: "Retrieved Product List",
            products,
            totalProducts,
            lastMonthProducts
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error retrieving product list"
        })
    }

 }*/

const getProductDetails = async(req: Request, res: Response)=> {
    try {
        const { id } = req.body;
        const product = await productModel.findById(id);
        res.json({
            data: product,
            success: true,
            error: false
        })
    } catch (error) {
        console.log(error);
        res.json({
            error: true,
            success:false,
            message: "An error occurred!"
        })
    }
}

 const removeProduct = async (req: Request, res: Response) => { 
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if(product) {
          res.json({
            ok: true,
            msg: "deleted Successfully",
          });  
        } else {
            res.json({
              ok: true,
              msg: "delete Usuccessful"
            });
        }
          
        
    } catch (error) {
        res.json({
            ok:false,
            msg: "Error in Deleting file",
            error: true
        })
    }
 }

export { getProductDetails }