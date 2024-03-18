const{Router} = require ("express");
const {verifyAuthToken} = require("../middleware/authenticate");
const {createCategory, 
    getAllCategory, 
    getSingleCategory, 
    updateSingleCategory,
    deleteCategory,} = require("../controlller/category.controller");

const categoryRouter = Router();

categoryRouter.post("/create", verifyAuthToken, createCategory);
categoryRouter.get("/all", getAllCategory);
categoryRouter.get("/:categoryId", verifyAuthToken, getSingleCategory );
categoryRouter.put("/:categoryId", verifyAuthToken, updateSingleCategory)
categoryRouter.delete("/:categoryId", verifyAuthToken, deleteCategory);


module.exports = categoryRouter;