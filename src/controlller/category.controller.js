const { validateData } = require("../helpers/helper");
const categoryModel = require("../models/category.model");

async function createCategory(req, res) {
  try {
    const { name, subCategory } = req.body;
    const keys = ["name"];
    const validate = validateData(req.body, keys);
    if (validate.error === true) {
      return res
        .status(400)
        .json({ message: `${validate.key} ${validate.message}` });
    }

    const category = new categoryModel({
      name,
      subCategory,
    });
    await category.save();
    res.status(200).json({
      message: "category created successfully",
      success:true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getAllCategory(req, res) {
  try {
    const category = await categoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "category fetched successfully",
      success:true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getSingleCategory(req, res) {
  try {
      const {categoryId} = req.params;
      const category = await categoryModel.findById(categoryId)
      if (!category){
        return res.status(404).json({error:"category not found", success:false})
      }
    res.status(200).json({
      message: "category fetched successfully",
      success:true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


async function updateSingleCategory(req, res) {
  try {
    const {categoryId} = req.params;
    const { name } = req.body;

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found", success:false });
    }

    res.status(200).json({
      message: "Category updated successfully",
      sucesss:true,
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const deletedcategory = await categoryModel.findByIdAndDelete(categoryId);

    if (!deletedcategory) {
      return res.status(404).json({ message: "category not found", success:false});
    }

    res.status(200).json({
      message: "category deleted successfully",
      success:"true",
      data: [],
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createCategory,
  getAllCategory,
  updateSingleCategory,
  getSingleCategory,
  deleteCategory,
};