import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/admin/Category'; // Adjust the import path if necessary
import { updateCategory, addCategory } from '../../redux/admin/Category'; 

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  const [newCategory, setNewCategory] = React.useState("");
  const [isListed, setIsListed] = React.useState(true);
  const [editCategoryId, setEditCategoryId] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Add or edit category
  const handleAddOrEditCategory = () => {
    if (!newCategory) {
      console.error('Category name cannot be empty');
      return;
    }

    if (editMode) {
      // Edit category
      dispatch(updateCategory({ id: editCategoryId, name: newCategory, listed: isListed }));
      resetForm();
    } else {
      // Add new category
      dispatch(addCategory({ name: newCategory, listed: isListed }));
      resetForm();
    }
  };

  // Start editing category
  const startEditingCategory = (category) => {
    setNewCategory(category.name);
    setIsListed(category.listed);
    setEditCategoryId(category._id);
    setEditMode(true);
  };

  // Reset form
  const resetForm = () => {
    setNewCategory('');
    setIsListed(true);
    setEditCategoryId(null);
    setEditMode(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Category Management</h2>
      </div>

      <div className="bg-white rounded shadow-md p-4">
        <table className="min-w-full bg-white mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="py-2 px-4 border-b">Category Name</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">
                  {category.listed ? (
                    <span className="text-green-500 font-semibold">Listed</span>
                  ) : (
                    <span className="text-gray-500 font-semibold">Unlisted</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b flex justify-center space-x-2">
                  <button onClick={() => startEditingCategory(category)} className="bg-blue-500 text-white p-2 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add / Edit Category */}
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-xl mb-4">{editMode ? 'Edit Category' : 'Add New Category'}</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category Name"
              className="border px-3 py-2 rounded-lg focus:outline-none focus:border-green-500"
            />
            <div className="flex items-center">
              <span className="mr-2">Listed</span>
              <input
                type="checkbox"
                checked={isListed}
                onChange={() => setIsListed(!isListed)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
            </div>
            <button
              onClick={handleAddOrEditCategory}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900"
            >
              {editMode ? 'Update' : 'Save'}
            </button>
            {editMode && (
              <button onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
