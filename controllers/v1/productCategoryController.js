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
