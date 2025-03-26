/**
 * Products Controller
 * Handles product listing, details, and cart operations
 */

const Product = require("../models/product.model");
const Category = require("../sample/categories");
const dbgr = require("debug")("development: products-controller");

/**
 * Shop page - Lists products with filtering and sorting
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const shop = async (req, res) => {
    try {
        // Extract query parameters with defaults
        const { 
            query = '', 
            sortBy = 'createdAt', 
            sortOrder = 'desc', 
            page = 1,
            category = '',
            subCategory = '',
            minPrice = '',
            maxPrice = ''
        } = req.query;
        
        const DEFAULT_LIMIT = 10;
        const pageNum = parseInt(page, 10);
        
        // Sorting order
        const order = sortOrder === 'desc' ? -1 : 1;

        // Build search criteria
        const searchCriteria = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { subCategory: { $regex: query, $options: 'i' } },
                { subSubCategory: { $regex: query, $options: 'i' } }
            ]
        };
        
        // Add category filter if provided
        if (category) {
            searchCriteria.category = category;
        }
        
        // Add subcategory filter if provided
        if (subCategory) {
            searchCriteria.subCategory = subCategory;
        }
        
        // Add price range filter if provided
        if (minPrice || maxPrice) {
            searchCriteria['variants.price'] = {};
            
            if (minPrice) {
                searchCriteria['variants.price'].$gte = parseInt(minPrice, 10);
            }
            
            if (maxPrice) {
                searchCriteria['variants.price'].$lte = parseInt(maxPrice, 10);
            }
        }

        // Count total products matching criteria
        const totalProducts = await Product.find(searchCriteria).countDocuments();

        // Fetch products with sorting and pagination
        const products = await Product.find(searchCriteria)
            .sort({ [sortBy]: order })
            .limit(DEFAULT_LIMIT * pageNum);

        // Render shop page with data
        res.render("shop", {
            Category,
            products,
            currentPage: pageNum,
            searchQuery: query,
            totalProducts,
            sortBy,
            sortOrder,
            category,
            subCategory,
            minPrice,
            maxPrice,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalProducts / DEFAULT_LIMIT),
                hasNextPage: DEFAULT_LIMIT * pageNum < totalProducts,
                hasPrevPage: pageNum > 1
            }
        });
    } catch (error) {
        dbgr("🛑 Shop Error:", error);
        
        req.session.shopError = "Failed to load products. Please try again.";
        
        res.status(500).render("shop", { 
            Category,
            products: [],
            currentPage: 1,
            searchQuery: '',
            totalProducts: 0,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            error: error.message
        });
    }
};

/**
 * Product details page
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const product = async (req, res) => {
    try {
        // Get product by ID
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).render("error", { 
                message: "Product not found",
                error: { status: 404 }
            });
        }

        // Get related products (same category and subcategory)
        const relatedProducts = await Product.find({
            _id: { $ne: product._id },
            category: product.category,
            subCategory: product.subCategory
        }).limit(4);

        // Get success/error messages from session
        const success = req.session.enquirySuccess || '';
        const error = req.session.enquiryError || '';
        
        // Clear session messages
        req.session.enquirySuccess = null;
        req.session.enquiryError = null;

        // Get user's cart item if exists
        let cartItem = null;
        if (req.user) {
            cartItem = req.user.cart.find(item => item.product.toString() === product._id.toString());
        }

        // Render product page
        res.render("product", { 
            product,
            relatedProducts,
            success,
            error,
            cartItem
        });
    } catch (error) {
        dbgr("🛑 Product Fetch Error:", error);
        
        res.status(500).render("error", { 
            message: "Error loading product",
            error: { status: 500 }
        });
    }
};

/**
 * Cart page
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const cart = async (req, res) => {
    try {
        const user = req.user;
        
        // Populate cart with product details
        await user.populate("cart.product");
        
        // Filter out null products (products that were deleted)
        user.cart = user.cart.filter(item => item.product !== null);
        
        // Calculate total price
        let totalPrice = 0;
        let totalDiscount = 0;
        let subtotal = 0;
        
        for (const item of user.cart) {
            const product = await Product.findById(item.product);
            
            if (product) {
                const variant = product.variants.find(p => p.size === item.size) || product.variants[0];
                const originalPrice = variant ? variant.price : 0;
                const discountedPrice = variant && variant.discount ? variant.discount : originalPrice;
                
                subtotal += originalPrice * item.quantity;
                totalPrice += discountedPrice * item.quantity;
                totalDiscount += (originalPrice - discountedPrice) * item.quantity;
            }
        }
        
        const finalTotal = totalPrice;
        
        // Get success/error messages from session
        const success = req.session.cartSuccess || req.session.enquirySuccess || '';
        const error = req.session.cartError || req.session.enquiryError || '';
        
        // Clear session messages
        req.session.cartSuccess = null;
        req.session.cartError = null;
        req.session.enquirySuccess = null;
        req.session.enquiryError = null;

        // Render cart page
        res.render("cart", { 
            user: user || "",
            cartSummary: {
                subtotal,
                discount: totalDiscount,
                total: finalTotal
            },
            success,
            error
        });
    } catch (error) {
        dbgr("🛑 Cart Error:", error);
        
        res.status(500).render("cart", { 
            user: req.user || "",
            cartSummary: {
                subtotal: 0,
                discount: 0,
                total: 0
            },
            error: "Failed to load cart"
        });
    }
};

/**
 * Add product to cart
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const addCart = async (req, res) => {
    try {
        const { productid } = req.params;
        const { quantity = 1, size = "None", direct } = req.query;
        const user = req.user;
        
        // Validate inputs
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        if (!productid) {
            req.session.cartError = "Invalid product";
            return res.redirect("/products/cart");
        }

        // Get product details
        const product = await Product.findById(productid);
        
        if (!product) {
            req.session.cartError = "Product not found";
            return res.redirect("/products/cart");
        }
        
        const { category, subCategory, subSubCategory, variants } = product;
        
        // Find selected variant
        const selectedVariant = variants.find(v => v.size === size) || variants[0];
        
        // Check if variant has stock
        if (selectedVariant.quantity < parseInt(quantity)) {
            req.session.cartError = `Only ${selectedVariant.quantity} items available`;
            return direct ? 
                res.redirect(`/products/shop?query=${subSubCategory || subCategory || category}`) : 
                res.redirect(`/products/product/${productid}`);
        }

        // Check if product already exists in cart with same size
        const cartItem = user.cart.find(item => 
            item.product.toString() === productid && 
            item.size === selectedVariant.size
        );
        
        if (cartItem) {
            // Update quantity if product exists
            const newQuantity = cartItem.quantity + parseInt(quantity);
            
            // Check if new quantity exceeds stock
            if (newQuantity > selectedVariant.quantity) {
                req.session.cartError = `Cannot add more than ${selectedVariant.quantity} items`;
                return direct ? 
                    res.redirect(`/products/shop?query=${subSubCategory || subCategory || category}`) : 
                    res.redirect(`/products/product/${productid}`);
            }
            
            cartItem.quantity = newQuantity;
        } else {
            // Add new item to cart
            user.cart.push({ 
                product: productid, 
                quantity: parseInt(quantity), 
                size: selectedVariant.size, 
                variantId: selectedVariant._id 
            });
        }

        // Save user cart
        await user.save();
        
        // Set success message
        req.session.cartSuccess = "Product added to cart";

        // Redirect based on source
        return direct ? 
            res.redirect(`/products/shop?query=${subSubCategory || subCategory || category}`) : 
            res.redirect(`/products/product/${productid}`);
    } catch (error) {
        dbgr("🛑 Add to Cart Error:", error);
        
        req.session.cartError = "Failed to add product to cart";
        
        return req.query.direct ? 
            res.redirect("/products/shop") : 
            res.redirect(`/products/product/${req.params.productid || ''}`);
    }
};

/**
 * Remove product from cart
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const deleteCart = async (req, res) => {
    try {
        const user = req.user;
        const { productid } = req.params;

        // Validate user
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find product in cart
        const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productid);
        
        if (cartItemIndex === -1) {
            req.session.cartError = "Product not found in cart";
            return res.redirect("/products/cart");
        }

        // Remove product from cart
        user.cart.splice(cartItemIndex, 1);
        await user.save();
        
        // Set success message
        req.session.cartSuccess = "Product removed from cart";

        // Redirect to cart
        res.redirect("/products/cart");
    } catch (error) {
        dbgr("🛑 Delete from Cart Error:", error);
        
        req.session.cartError = "Failed to remove product from cart";
        res.redirect("/products/cart");
    }
};

/**
 * Update cart item (quantity and size)
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const updateCart = async (req, res) => {
    try {
        const { productid } = req.params;
        const { quantity = 1, size = "None" } = req.body;
        const user = req.user;

        // Validate user
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find product in cart
        const cartItem = user.cart.find(item => item.product.toString() === productid);
        
        if (!cartItem) {
            req.session.cartError = "Product not found in cart";
            return res.redirect("/products/cart");
        }

        // Get product details
        const product = await Product.findById(productid);
        
        if (!product) {
            req.session.cartError = "Product not found";
            return res.redirect("/products/cart");
        }
        
        // Find selected variant
        const selectedVariant = product.variants.find(v => v.size === size) || product.variants[0];
        
        // Check if variant has stock
        if (selectedVariant.quantity < parseInt(quantity)) {
            req.session.cartError = `Only ${selectedVariant.quantity} items available`;
            return res.redirect("/products/cart");
        }

        // Update cart item
        cartItem.quantity = parseInt(quantity);
        cartItem.size = size;
        cartItem.variantId = selectedVariant._id;

        // Save user cart
        await user.save();
        
        // Set success message
        req.session.cartSuccess = "Cart updated successfully";

        // Redirect to cart
        res.redirect("/products/cart");
    } catch (error) {
        dbgr("🛑 Update Cart Error:", error);
        
        req.session.cartError = "Failed to update cart";
        res.redirect("/products/cart");
    }
};

/**
 * Add product to wishlist
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const addToWishlist = async (req, res) => {
    try {
        const { productid } = req.params;
        const user = req.user;

        // Check if product exists
        const product = await Product.findById(productid);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if product is already in wishlist
        const isInWishlist = user.wishlist.some(item => 
            item.product.toString() === productid
        );

        if (!isInWishlist) {
            user.wishlist.push({ product: productid });
            await user.save();
        }

        // Return to previous page
        res.redirect(req.headers.referer || '/products/shop');
    } catch (error) {
        dbgr("🛑 Add to Wishlist Error:", error);
        res.redirect('/products/shop');
    }
};

/**
 * Remove product from wishlist
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const removeFromWishlist = async (req, res) => {
    try {
        const { productid } = req.params;
        const user = req.user;

        // Remove product from wishlist
        user.wishlist = user.wishlist.filter(item => 
            item.product.toString() !== productid
        );
        await user.save();

        // Return to previous page
        res.redirect(req.headers.referer || '/products/wishlist');
    } catch (error) {
        dbgr("🛑 Remove from Wishlist Error:", error);
        res.redirect('/products/shop');
    }
};

const wishlist = async (req, res) => {
    const user = req.user;
    await user.populate("wishlist.product");
    res.render("wishlist", { user: user });
};

module.exports = {
    shop,
    product,
    cart,
    addCart,
    deleteCart,
    updateCart,
    addToWishlist,
    removeFromWishlist,
    wishlist
};