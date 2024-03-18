const { validateData } = require("../helpers/helper");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");

async function createProduct(req, res) {
  
  try {
    const { name, description, quantity, price, categoryId } = req.body;
    const keys = ["name", "description", "quantity", "price", "categoryId"];
    const validate = validateData(req.body, keys);
    if (validate.error === true) {
      return res
        .status(400)
        .json({ message: `${validate.key} ${validate.message}` });
    }
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category) {
      return res.status(400).json({ message: "Category does not exist", success:false });
    }

    const product = new productModel({
      name,
      description,
      quantity,
      price,
      category: category._id,
    });

    await product.save();

    res.status(200).json({
      message: "Product created successfully",
      success:true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


async function getAllProducts(req, res) {
  try {
    const products = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Product fetched successfully",
      success:true,
      data: products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


async function getSingleProduct(req, res) {
  const productId = req.params.productId;
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      success:true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



async function updateProduct(req, res) {
  const productId = req.params.productId;
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      success:true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


async function deleteProductById(req, res) {
  try {
    const productId = req.params.productId;
    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      success:true,
      data: [],
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProductById,
};