import { useEffect, useState, useCallback } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get("/admin/getproducts");
      setProducts(response?.data?.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  const editProduct = useCallback(
    (productId) => {
      navigate(`/admin/edit-product/${productId}`);
    },
    [navigate]
  );

  // const handleToggleStatus = useCallback(async (id, currentStatus) => {
  //   try {
  //     const response = await api.patch(`/admin/toggleproduct/${id}`, { listed: !currentStatus });
  //     console.log(response);
  //     fetchProducts();
  //   } catch (error) {
  //     console.error("Error updating product status:", error);
  //   }
  // }, [fetchProducts]);

  const handleDelete = useCallback(async (id, deleted) => {
    try {
      if (deleted) {
        // If product is deleted, perform undelete
        await api.patch(`/admin/undeleteproduct/${id}`);
      } else {
        // If product is listed, perform deletion
        await api.delete(`/admin/deleteproduct/${id}`);
      }
      fetchProducts();
    } catch (error) {
      console.error("Error deleting or undeleting product:", error);
    }
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow-md rounded my-6">
        <div className="py-4 px-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Product List</h2>
          <button
            onClick={() => navigate("/admin/addproduct")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Product
          </button>
        </div>

        <div className="p-6">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Sale Price</th>
                <th className="py-2 px-4 border-b">Qty</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Update</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{product.productName}</td>
                    <td className="py-2 px-4 border-b">{product.category}</td>
                    <td className="py-2 px-4 border-b">{product.salePrice}</td>
                    <td className="py-2 px-4 border-b">{product.quantity}</td>
                    <td className="py-2 px-4 border-b">
                      {!product.deleted ? (
                        <span className="text-green-500">Listed</span>
                      ) : (
                        <span className="text-gray-500">Unlisted</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b flex justify-center space-x-2">
                      <button
                        onClick={() => editProduct(product._id)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.deleted)}
                        className={`p-2 rounded ${product.deleted ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      >
                        {product.deleted ? <MdRestore /> : <MdDelete />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 border-b text-center">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">1 of 10 Pages</span>
            <div className="flex space-x-2">
              <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400">
                {"<"}
              </button>
              <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400">
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
