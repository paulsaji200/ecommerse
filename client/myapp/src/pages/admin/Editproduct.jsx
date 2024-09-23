import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import { fetchCategories } from "../../redux/admin/Category";

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    productName: '',
    category: '',
    categoryName: '',
    description: '',
    productPrice: '',
    salePrice: '',
    quantity: '',
    brandName: '',
    images: [], // URLs of images
    files: [], // File objects
  });
  const [errors, setErrors] = useState({});
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories()); // Fetch categories when the component mounts
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0) {
      const fetchProductDetails = async () => {
        try {
          const response = await api.get(`/admin/geteditproduct/${productId}`);
          const product = response.data.data;
          setProductData({
            ...product,
            categoryName: categories.find(cat => cat._id === product.category)?.name || '',
            images: product.images || [], // Set images if available
            files: [], // Initialize files as empty
          });
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }
  }, [categories, productId]);

  const url = "https://api.cloudinary.com/v1_1/dasqrolmh/upload";
  const uploadPreset = "mern_product";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat._id === value);
      setProductData({
        ...productData,
        category: value,
        categoryName: selectedCategory ? selectedCategory.name : '',
      });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, 3 - productData.files.length); // Limit to 3 files

    const imagePreviews = newFiles.map(file => URL.createObjectURL(file));

    setProductData(prevState => ({
      ...prevState,
      images: [...prevState.images, ...imagePreviews], // Append new image previews
      files: [...prevState.files, ...newFiles], // Append new file objects
    }));
  };

  const handleImageRemove = (image) => {
    setProductData(prevState => {
      const updatedImages = prevState.images.filter(img => img !== image);
      const indexToRemove = prevState.images.indexOf(image);
      const updatedFiles = prevState.files.filter((_, index) => index !== indexToRemove);

      return {
        ...prevState,
        images: updatedImages,
        files: updatedFiles,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!productData.productName) newErrors.productName = "Product name is required";
    if (!productData.category) newErrors.category = "Category is required";
    if (!productData.description) newErrors.description = "Description is required";
    if (!productData.productPrice || isNaN(productData.productPrice)) newErrors.productPrice = "Valid product price is required";
    if (!productData.salePrice || isNaN(productData.salePrice)) newErrors.salePrice = "Valid sale price is required";
    if (!productData.quantity || isNaN(productData.quantity)) newErrors.quantity = "Valid quantity is required";
    if (!productData.brandName) newErrors.brandName = "Brand name is required";

    if (productData.files.length > 0 && productData.files.length < 3) {
      newErrors.files = "At least three images are required";
    } else if (productData.files.length === 0 && productData.images.length === 0) {
      newErrors.files = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // If validation fails, do not proceed

    try {
      let uploadedImages = productData.images; // Default to existing images

      if (productData.files.length > 0) {
        uploadedImages = await Promise.all(
          productData.files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);

            const response = await fetch(url, {
              method: "POST",
              body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();
            return data.secure_url;
          })
        );

        uploadedImages = [...productData.images, ...uploadedImages]; // Combine old and new images
      }

      const finalProductData = {
        ...productData,
        images: uploadedImages,
      };

      await api.put(`/admin/updateproduct/${productId}`, finalProductData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="w-3/4 p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={productData.productName || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter product name"
            />
            {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Category:</label>
            <select
              name="category"
              value={productData.category || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Description:</label>
          <textarea
            name="description"
            value={productData.description || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter product description"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Product Price:</label>
            <input
              type="number"
              name="productPrice"
              value={productData.productPrice || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter product price"
            />
            {errors.productPrice && <p className="text-red-500 text-sm">{errors.productPrice}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Sale Price:</label>
            <input
              type="number"
              name="salePrice"
              value={productData.salePrice || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter sale price"
            />
            {errors.salePrice && <p className="text-red-500 text-sm">{errors.salePrice}</p>}
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter quantity"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Brand Name:</label>
            <input
              type="text"
              name="brandName"
              value={productData.brandName || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter brand name"
            />
            {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700"
          />
          {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
          <div className="mt-4 flex space-x-2">
            {productData.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Product ${index}`} className="w-24 h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(image)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
