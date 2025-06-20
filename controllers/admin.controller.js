const { PASSCODE } = require("../config/environment");
const Product = require("../models/product.model");
const User = require("../models/user.model");

const searchAdminMod = async (req, res) => {
    const searchQuery = req.query.query || '';
    const page = parseInt(req.query.page) || 1;
    const DEFAULT_LIMIT = 25;

    // Build search criteria
    const searchCriteria = {
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } },
            { subCategory: { $regex: searchQuery, $options: 'i' } },
            { subSubCategory: { $regex: searchQuery, $options: 'i' } }
        ]
    };

    // Use aggregation for better query performance
    const aggregationPipeline = [
        { $match: searchCriteria },
        { $limit: DEFAULT_LIMIT },
        { $count: 'total' }
    ];

    const [products] = await Promise.all([
        Product.find(searchCriteria).limit(DEFAULT_LIMIT * page),
        Product.aggregate(aggregationPipeline)
    ]);

    const totalProducts = await Product.find(searchCriteria).countDocuments();

    res.render("admin-dashboard", { products, searchQuery, totalProducts, currentPage: parseInt(page) });
}

const createProduct = async (req, res) => {
    try {
        const imageDocs = req.files.map(file => ({
            imageBuffer: file.buffer,
            contentType: file.mimetype,
        }));
    
        const productData = {
            ...req.body,
            images: imageDocs,
            quality: req.body.quality || "",
            fabricDetails: req.body.fabricDetails || "Not specified"
        };

        await Product.create(productData);
        res.status(200).redirect("/admin/");
    } catch (e) {
        console.log("ERROR", e);
        res.status(400).json({
            err: e.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        await Product.findOneAndDelete({ _id: req.params.productid });
        res.redirect("/admin");
    } catch (e) {
        res.status(400).json({
            err: e.message
        });
    }
}

const updatePageP = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.productid });
        res.render("update-product", { product });
    } catch (e) {
        res.status(400).json({
            err: e.message
        });
    }
}

const editProduct = async (req, res) => {
    try {
        const { title, category, subCategory, subSubCategory, description, fabricDetails, quality, variants } = req.body;
        
        await Product.findOneAndUpdate(
            { _id: req.params.productid }, 
            { 
                title, 
                category, 
                subCategory, 
                subSubCategory, 
                description,
                fabricDetails,
                quality,
                variants 
            }
        );
        
        res.redirect("/admin");
    } catch (e) {
        res.status(400).json({
            err: e.message
        });
    }
}

const makeAdmin = async (req, res) => {
    try {
        const passcode = req.query.passcode;

        if (passcode === PASSCODE) {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                { role: "admin" },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "🎉 You are now an admin!",
                user
            });
        }

        return res.status(400).json({
            success: false,
            message: "❌ Invalid passcode!"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "⚠️ Internal Server Error",
            error: error.message
        });
    }
}

module.exports = {
    searchAdminMod,
    createProduct,
    deleteProduct,
    updatePageP,
    editProduct,
    makeAdmin
};