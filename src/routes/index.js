const express = require("express");
const userRouter = require("./user.routes");
const productRouter = require("./product.routes");
const categoryRouter = require("./category.routes");

const router = express.Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter)

module.exports = router 