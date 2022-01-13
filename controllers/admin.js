const Product = require('../models/product')

exports.getAddProduct= (req,res,next)=>{

    // res.sendFile(path.join(rootPath,"views","add-product.html"));
    res.render('admin/edit-product',{
        pageTitle: 'Add Product',
    path: "/admin/add-product",
  
 })
}

exports.postAddProduct =(req,res,next)=>{
    const product = new Product(req.body.title,req.body.imageUrl,req.body.price,req.body.description)
    product.save();
    res.redirect('/');
    }

    exports.getEditProduct= (req,res,next)=>{

        // res.sendFile(path.join(rootPath,"views","add-product.html"));
        res.render('admin/edit-product',{
            pageTitle: 'Edit Product',
        path: "/admin/edit-product",
      
     })
    }

    exports.getProducts= (req,res,next)=>{

        // res.sendFile(path.join(rootPath,"views","add-product.html"));
        Product.fetchAll(products=>{
            res.render('admin/products',{prods: products,
                pageTitle: 'All Products', 
                path : '/admin/products', 
                
            });
        });
    }