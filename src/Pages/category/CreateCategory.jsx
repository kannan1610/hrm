import React, { useState } from 'react';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { post } from '../../api'; // Ensure this is correctly implemented in your project
import Swal from 'sweetalert2';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState();
  const [message, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    setCategory(e.target.value);
  };

  const handleCancel = () => {
    setCategory('');
    navigate('/categorylist');
  };
  console.log(category);
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await post('/category', { category },); // Sending category as an object
      console.log('Response:', response.data);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Category created successfully!',
      }).then(() => {
        navigate('/categorylist');
      });
    } catch (error) {
      setResponseMessage('Error submitting form.');
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: errorMessage,
      });
      console.error('Submit Error:', error);
    }
  };

  return (
    <div className="h-full p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Create Category</h2>
        <Link to="/categorylist">
          <button className="w-36 py-1.5 bg-primary text-white rounded cursor-pointer flex items-center justify-center gap-2">
            Category List
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="py-10 flex flex-col gap-80">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-10">
          <TextInput
            label="Category"
            name="category"
            value={category}
            placeholder="Enter the category"
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-center items-center gap-5">
          <Button
            label="Cancel"
            onClick={handleCancel}
            className="bg-white border border-gray-800"
          />
          <Button
            label="Save"
            onClick={handleSubmit}
            className="text-white bg-primary border border-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
