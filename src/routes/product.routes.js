const {Router} = require("express")
const {verifyAuthToken} = require("../middleware/authenticate");
const {createProduct, 
    getAllProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProductById} = require("../controlller/product.controller");

const productRouter = Router();

productRouter.post("/create", verifyAuthToken, createProduct);
productRouter.get("/all", verifyAuthToken, getAllProducts);
productRouter.get("/:productId", verifyAuthToken, getSingleProduct);
productRouter.put("/:productId", verifyAuthToken, updateProduct); 
productRouter.delete("/:productId", verifyAuthToken, deleteProductById)

module.exports = productRouter;





