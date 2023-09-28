const User = require('../models/user.model');


exports.findAll = async(req, res) => {

    console.log("Find all user's products");

    try {
        results = await User.find({}, {username: 1, products: 1})
        res.status(200).json({status: true, data: results});
        console.log("Success in reading all user's products");

    } catch (error) {
        res.status(400).json({status: false, data: error});
        console.log("Problem in reading user's products");
    }


}


exports.findOne = async(req, res) => {

    const username = req.params.username;

    console.log("Find user: ", username);

    try {
        const result = await User.findOne({username: username}, {username: 1, products: 1});

        res.status(200).json({status: true, data: result});
        console.log("Success in reading user's products");

    } catch (error) {
        res.status(400).json({status: false, data: error});
        console.log("Problem in finding user's products");
    }

}



exports.addProduct = async (req, res) => {
    const username = req.body.username;
    const products = req.body.products;

    console.log("Insert product to username", username);

    try {
        const result = await User.updateOne(
            { username: username},
            {
                $push: {
                    products: products
                }
            }
        );

        res.status(200).json({status: true, data: result});
        console.log("Success in saving product");

    } catch (error) {
        res.status(400).json({status: false, data: error});
        console.log("Problem in saving product");
    }

}


exports.updateProduct = async(req, res) => {


    const username = req.params.username;
    const product_id = req.body.product._id;
    const product_quantity = req.body.product.quantity;

    console.log("Updating product for ", username);

    try {
        const result = await User.updateOne (
            { username: username, "products._id": product_id},
            {
                $set: {
                    "products.$.quantity": product_quantity
                }
            }
        );

        res.status(200).json({status: true, data: result});
        console.log("Success in updating product for ", username);
    } catch (error) {
        res.status(400).json({status: false, data: error});
        console.log("Problem in updating product for ", username);
    }
}


exports.deleteProduct = async (req, res) => {
    const username = req.params.username;
    const product = req.params.product;

    try {
        const result = await User.updateOne(
            {username: username},
            {
                $pull: {
                    products: {product: product}
                }
            }
        )

        res.status(200).json({status: true, data: result});
        console.log("Success in deleting product for ", username);

    } catch (error) {
        res.status(400).json({status: false, data: error});
        console.log("Problem in deleting product for ", username);
    }
}


exports.stats1 = async (req, res) => {
    console.log("For all users sum by product and count");

    try {
        const result = await User.aggregate(
            [
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        id: 1,
                        username: 1,
                        products: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            username: "$username",
                            product: "$products.product"
                        },
                        totalAmount: {
                            $sum: {
                                $multiply: [ "$products.cost", "$products.quantity"]
                            }
                        },
                        count: { $sum: 1 }                        
                    }
                }
            ]        
        )
        res.status(200).json({status: true, data: result});
        console.log("Success in stats1");

    } catch (error) {
        res.status(400).json({status: false, data: error});
        console.log("Problem in stats1");
    }
}




