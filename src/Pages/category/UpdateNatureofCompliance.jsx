import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from "sweetalert2";
import { get, put } from "../../api";
import Button from '../../Components/Button';
const UpdateNatureOfCompliance = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [compliance, setCompliance] = useState('')

    useEffect(() => {
        const fetchNatureofCompliance = async () => {
            try {
                const response = await get(`/natureofcompliancelist?id=${id}`); // Assuming this is the correct endpoint
                if (response.data && response.data.length > 0) {
                    setCompliance(response.data[0].nature); 
                }
            } catch (error) {
                console.error("Error fetching Nature of Compliance:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to load Nature of Compliance data.',
                });
            }
        };
        fetchNatureofCompliance();
    }, [id]);
    console.log(compliance)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const response = await put(`/natureofcompliance/${id}`, { compliance }); 
            console.log('Response:', response.data);

            // Show success message on successful update
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Nature of Compliance updated successfully!',
                confirmButtonColor: "#D7B95F",
            }).then(() => {
                navigate('/naturecompliancelist'); 
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

    return (
        <div className='h-full bg-white p-5 rounded-md shadow-lg'>
            <h1 className='text-xl font-semibold'>Edit Nature of Compliance</h1>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-wrap justify-between mt-6 h-[400px]'>
                    <div className='w-full sm:max-w-[600px] flex flex-col gap-2'>
                        <label className='text-md font-semibold'>Nature Of Compliance</label>
                        <input type="text" placeholder='Enter nature of compliance' value={compliance}
                            className='border border-gray-400 rounded-md px-2 py-1 w-full focus-visible:outline-none'
                            onChange={(e) => setCompliance(e.target.value)} />
                    </div>
                </div>
                <div className='flex justify-center items-center gap-5'>
                <Button label="Cancel" className="bg-white border border-gray-800" onClick={() => navigate('/naturecompliancelist')}/>
                <Button label="Save" type="submit" className="text-white bg-primary border border-yellow-500" />
                </div>
            </form>
        </div>
    )
}

export default UpdateNatureOfCompliance
