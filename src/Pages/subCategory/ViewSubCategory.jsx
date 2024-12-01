import React, { useState, useEffect } from 'react';
import { HiOutlineDownload } from "react-icons/hi";
import Swal from "sweetalert2";
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../../api';

const Viewsub = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Data, setData] = useState({
    category: '',
    subcategory: ''
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories and subcategory details
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await get('/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        Swal.fire('Error', 'Failed to load categories.', 'error');
      }
    };

    const fetchSubCategory = async () => {
      try {
        const response = await get(`/subcategorylist?id=${id}`);
        if (response.data && response.data.length > 0) {
          const subcategoryData = response.data[0];
          setData({
            category: subcategoryData.category_id,
            subcategory: subcategoryData.subcategory_name
          });
        }
      } catch (error) {
        console.error('Error fetching subcategory:', error);
        Swal.fire('Error', 'Failed to load subcategory.', 'error');
      }
    };

    fetchCategories();
    fetchSubCategory();
  }, [id]);
  console.log(Data);
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await put(`/subcategory/${id}`, {
        category_id: Data.category,
        subcategory_name: Data.subcategory
      });
      Swal.fire('Success', 'Subcategory updated successfully!', 'success').then(() => {
        navigate('/subcatlist');
      });
    } catch (error) {
      console.error('Error updating subcategory:', error);
      Swal.fire('Error', 'Failed to update subcategory.', 'error');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/subcatlist');
  };

  return (
    <div className="p-5">
      <h2 className="font-semibold text-lg mb-4">View Sub Category</h2>
      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="font-semibold mb-2 block">Category</label>
          <select
            name="category"
            value={Data.category}
            onChange={handleInputChange}
            className="bg-gray-100 border text-sm border-gray-300 py-2 px-4 w-full rounded-md"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold mb-2 block">Sub Category</label>
          <input
            type="text"
            name="subcategory"
            value={Data.subcategory}
            onChange={handleInputChange}
            className="bg-gray-100 border text-sm border-gray-300 py-2 px-4 w-full rounded-md"
            placeholder="Enter the subcategory"
            required
          />
        </div>
        <div className="lg:col-span-2 flex justify-center gap-5 mt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-black py-2 px-6 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white bg-yellow-500 py-2 px-6 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Viewsub;
