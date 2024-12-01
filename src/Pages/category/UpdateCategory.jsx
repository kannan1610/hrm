import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../../api'; // Ensure 'put' is correctly imported from your API
import Swal from "sweetalert2";
import Button from '../../Components/Button';

const UpdateCategory = () => {
    const { id } = useParams(); // Fetching the ID from the URL
    const navigate = useNavigate();
    const [category, setCategory] = useState(''); // State to hold category name

    // Fetch the category on component mount or if the id changes
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await get(`/categorylist?id=${id}`); // Assuming this is the correct endpoint
                if (response.data && response.data.length > 0) {
                    setCategory(response.data[0].category_name); // Set category name from API response
                }
            } catch (error) {
                console.error("Error fetching category:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to load category data.',
                });
            }
        };
        fetchCategory();
    }, [id]); // Depend on id to refetch if it changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setBranch({ ...branch, [name]: value, })
    }


    // Handle form submission to update the category
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await put(`/category/${id}`, { category }); // Sending updated category as payload
            console.log('Response:', response.data);

            // Show success message on successful update
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Category updated successfully!',
                confirmButtonColor: "#D7B95F",
            }).then(() => {
                navigate('/categorylist'); // Redirect to the category list page
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: errorMessage,
            });
            console.error('Submit Error:', error);
        }
    };
    const handleCancel = (id) => {
        navigate(`/categorylist`); // Redirect to view page
      };
    return (
        <div className='h-full bg-white p-5 rounded-md shadow-lg'>
            <h1 className='text-xl font-semibold'>Edit Category</h1>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-wrap justify-between mt-6 h-[400px]'>
                    <div className='w-full sm:max-w-[600px] flex flex-col gap-2'>
                        <label className='text-md font-semibold'>Category</label>
                        <input 
                            type="text" 
                            placeholder='Enter category' 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)} 
                            className='border border-gray-400 rounded-md px-2 py-1 w-full focus-visible:outline-none'
                        />
                    </div>
                </div>
                <div className='flex justify-center items-center gap-5'>
                    <Button label="Cancel" type='reset' onClick= {handleCancel} className="bg-white border border-gray-800" />
                    <Button label="Save" type="submit" className="text-white bg-primary border border-yellow-500" />
                </div>
            </form>
        </div>
    );
};

export default UpdateCategory;
