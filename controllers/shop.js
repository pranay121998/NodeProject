const Product = require('../models/product')
const Cart =  require('../models/cart')

exports.getProducts =(req,res,next)=>{
    // console.log("shop ",adminData.products)
    // res.sendFile(path.join(rootPath,"views","shop.html"));
    // // next()
    Product.fetchAll(products=>{
        res.render('shop/product-list',{prods: products,
            pageTitle: 'All Products', 
            path : '/products', 
            
        });
    });
   
}

exports.getProduct =(req,res,next)=>{
    
const prodId= req.params.productId;
// console.log(prodId)   
Product.findById(prodId,(product) =>{
    res.render('shop/product-detail',{pageTitle:product.title,
        product : product,
        path: '/products'})
});
// res.redirect('/')

}

exports.getIndex =(req,res,next)=>{
   
    Product.fetchAll(products=>{
        res.render('shop/index',{prods: products,
            pageTitle: 'Shop', 
            path : '/', 
        });
    });
   
}


exports.getCart = (req,res,next)=>{
    res.render('shop/cart',{
        pageTitle:'Cart',
        path:'/cart',

    })
}

exports.postCart = (req,res,next)=>{
   const prodId = req.body.productId;
//    console.log("dgfgf",prodId);
Product.findById(prodId, (products)=>{
     Cart.addProduct(prodId , products.price)
})
   res.redirect('/cart')
}

exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        pageTitle:'Orders',
        path:'/orders',

    })
}

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        pageTitle:'Checkout',
        path:'/checkout',

    })
}