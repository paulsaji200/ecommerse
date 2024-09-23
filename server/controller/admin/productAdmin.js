import Product from "../../models/productModel.js";
import Category from "../../models/Categorymodel.js";
import Users from "../../models/userModel.js";


const addproduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      description,
      productPrice,
      salePrice,
      quantity,
      brandName,
      images,
    } = req.body;

    const product = new Product({
      productName,
      category,
      description,
      productPrice,
      salePrice,
      quantity,
      brandName,
      images,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Failed to add product",
    });
  }
};

export const editProduct = async (req, res) => {
  console.log("hittedbbbb");
  try {
    const { id } = req.params;
    const {
      productName,
      category,
      description,
      productPrice,
      salePrice,
      quantity,
      brandName,
      images,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      {
        productName,
        category,
        description,
        productPrice,
        salePrice,
        quantity,
        brandName,
        images,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

export const addcategory = async (req, res) => {
  try {
    const { name, listed } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    console.log("Received data:", req.body);

    const category = new Category({ name, listed });
    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Error creating category",
      error: error.message,
    });
  }
};
export const deletecategory = async (req, res) => {
  console.log("lllllllll");
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { listed: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category soft deleted successfully", category });
  } catch (error) {
    console.error("Error soft deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getcategories = async (req, res) => {
  const data = await Category.find();
  res.status(201).send({ data: data });
};
export const viewcustomer = async (req, res) => {
  console.log("hitted");
  try {
    const customers = await Users.find({});
    res.status(201).send({ data: customers });
  } catch {
    res.status(401);
  }
};

export const editCategory = async (req, res) => {
  const { id } = req.params;
  const { name, listed } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        listed,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getproductAdmin = async (req, res) => {
  const data = await Product.find();
  res.status(201).send({ data: data });
};

export const geteditproduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    console.log(product);
    res.status(201).send({ data: product });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product successfully deleted", product });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const unDeleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product successfully undeleted", product });
  } catch (error) {
    console.error("Error  undeleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default addproduct;
