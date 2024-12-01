import { Link, useNavigate } from 'react-router-dom'
import TextInput from '../../Components/TextInput'
import axios from 'axios';
import { get, post } from '../../api';
import Swal from 'sweetalert2';
import React, { useState } from 'react';
import Button from '../../Components/Button';
const NatureofCompliance = () => {
  const navigate = useNavigate()
  const [nature, setNature] = useState('');
  const [message, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    setNature(e.target.value)
  }

  const handleCancel = () => {
    setNature('')
    navigate('/naturecompliancelist')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const response = await fetch('http://localhost:5000/api/natureofcompliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nature })
    })

    const data = await response.json()
    if (response.ok) {
      console.log(data)
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Nature of Compliance Created successfully!',
      }).then(() => {
        navigate('/naturecompliancelist');
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Nature of Compliance Cannot Created successfully!',
      });
    }

    // try {
    //   const response = await post('/natureofcompliance', {nature}); // Replace '/submit' with your endpoint
    //   if (response.data.ok)
    //   console.log('Response:', response.data);
    //   Swal.fire({

    //     icon: 'success',
    //     title: 'Success!',
    //     text: 'Nature of Compliance Created successfully!',
    //   }).then(() => {
    //     navigate('/naturecompliancelist');
    //   });
    // } catch (error) {
    //   setResponseMessage('Error submitting form.');
    //   Swal.fire({

    //     icon: 'error',
    //     title: 'Failed!',
    //     text: 'Nature of Compliance Cannot Created successfully!',
    //   });
    //   console.error('Submit Error:', error);
    // }
  };
  return (
    <div className='h-full p-5 shadow-lg'>
      <div className="flex items-center justify-between">
        <h2 className='text-xl font-bold'>Create Nature of Compliance</h2>
        <Link to="/categorylist"><button className="w-36 py-1.5 bg-primary text-white rounded cursor-pointer flex items-center justify-center gap-2">
          Nature of Compliance List
        </button></Link>
      </div>
      <form onSubmit={handleSubmit} className='py-10 flex flex-col gap-80'>
        <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-10'>
          <TextInput label='Nature Of Compliance' name='nature' value={nature} placeholder='Enter the Nature of Compliances' onChange={handleInputChange} />
        </div>

        <div className='flex justify-center items-center gap-5'>
          <Button label='Cancel' onClick={handleCancel} className='bg-white border border-gray-800' />
          <Button label='Save' type='submit' className='text-white bg-primary border border-primary' />
        </div>
      </form>
    </div>
  )
}

export default NatureofCompliance
