const { default: mongoose } = require('mongoose');
const Meal = require('../../models/mealCountModel');
const ProductCategory = require('../../models/productCategoryModel');
exports.getProductCategories = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.status(200).json(productCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product categories', error });
  }
};

exports.createProductCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new ProductCategory({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product category', error });
  }
};

exports.updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await ProductCategory.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Product category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product category', error });
  }
};

exports.deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await ProductCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Product category not found' });
    }
    res.status(200).json({ message: 'Product category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product category', error });
  }
};
exports.getExtraShoppingWithCategory = async (req, res) => {
  try {

    const data = await Meal.aggregate([

      // Break extraShoppingComments array
      { $unwind: "$extraShoppingComments" },

      // Break comment array
      { $unwind: "$extraShoppingComments.comment" },

      // Join ProductCategory
      {
        $lookup: {
          from: "productcategories", // mongoose lowercase + plural
          localField: "extraShoppingComments.comment.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },

      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },

      // Join User (optional but recommended)
      {
        $lookup: {
          from: "users",
          localField: "extraShoppingComments.user",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      // filter with managerId
      {
        $match: { 
          "mealManager": mongoose.Types.ObjectId(req.params.managerId)
        }
      },
      // Final Output Shape
      {
        $project: {
          _id: 0,
          mealDate: "$date",
          month: 1,
          year: 1,

          productName: "$extraShoppingComments.comment.productName",
          productCount: "$extraShoppingComments.comment.productCount",
          unitPrice: "$extraShoppingComments.comment.unitPrice",

          categoryId: "$categoryInfo._id",
          categoryName: "$categoryInfo.name",

          userId: "$userInfo._id",
          userName: "$userInfo.name",

          commentCreatedAt: "$extraShoppingComments.createdAt"
        }
      }

    ]);

    res.status(200).json({
      success: true,
      total: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getMarketingWithCategory = async (req, res) => {
  try {
    const data = await Meal.aggregate([

      // Break extraShoppingComments array
      { $unwind: "$shoppingComments" },

      // Break comment array
      { $unwind: "$shoppingComments.comment" },

      // Join ProductCategory
      {
        $lookup: {
          from: "productcategories", // mongoose lowercase + plural
          localField: "shoppingComments.comment.category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },

      { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },

      // Join User (optional but recommended)
      {
        $lookup: {
          from: "users",
          localField: "shoppingComments.user",
          foreignField: "_id",
          as: "userInfo"
        }
      },

      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      // filter with managerId
      {
        $match: {
          "mealManager": mongoose.Types.ObjectId(req.params.managerId)
        }
      },
      // Final Output Shape
      {
        $project: {
          _id: 0,
          mealDate: "$date",
          month: 1,
          year: 1,

          productName: "$shoppingComments.comment.productName",
          productCount: "$shoppingComments.comment.productCount",
          unitPrice: "$shoppingComments.comment.unitPrice",

          categoryId: "$categoryInfo._id",
          categoryName: "$categoryInfo.name",

          userId: "$userInfo._id",
          userName: "$userInfo.name",

          commentCreatedAt: "$shoppingComments.createdAt"
        }
      }

    ]);

    res.status(200).json({
      success: true,
      total: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
