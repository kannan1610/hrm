import React, { useState,useEffect } from 'react'
import TextInput from '../../Components/TextInput'
import SelectInput from '../../Components/SelectInput'
import Button from '../../Components/Button'
import FileInput from '../../Components/FileInput'
import { useNavigate } from 'react-router-dom'
import CheckedSelect from "../../Components/CheckedSelect";
import { get,post } from '../../api';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateUser = () => {
    const [role,setRole]=useState([])
    const [imgpreview,setImgpreview] = useState();
    const [module,setModule]=useState([])
    const [company,setCompany]=useState([])
    const navigate=useNavigate()
    const [user, setUser] = useState({
        username: '', email: '', companyAccess: '', role: '', password: '', modulesAccess: '', userImage: null,
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImgpreview(URL.createObjectURL(file));
            setUser({ ...user,userImage: file})
        }
    }

    const handleCancel = () => {
        setUser({
            username: '', email: '', companyAccess: '', role: '', password: '', modulesAccess: '', userImage: null,
        })
        navigate('/userlist')
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(user).forEach((key) => {
            formData.append(key, user[key]);
        });

        try {
            const response = await post("/user", formData,{
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Company created successfully!",
            }).then(() => navigate("/userlist"));
        } catch (error) {
            console.error("Submit Error:", error);
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Company record creation failed.",
            });
        }
    };

    useEffect(() => {
        const fetchCompany = async () => {
            const response = await get('/company');
            setCompany(response.data);
        };
        fetchCompany();

        const fetchRole = async () => {
            const response = await get('/role');
            setRole(response.data);
        };
        fetchRole();

        const fetchModule = async () => {
            const response = await get('/modules');
            setModule(response.data);
        };
        fetchModule();
    }, []);
    console.log(role);
    return (
        <div className='h-full p-5 shadow-lg'>
            <h2 className='text-xl font-bold'>Create User</h2>
            <form onSubmit={handleSubmit} className='pt-4 lg:p-0'>
                <FileInput imageLabel='User Profile Photo' onImageChange={handleFileChange} imageSection={imgpreview} />
                <div className='grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 lg:gap-10'>
                    <div className='flex flex-col gap-3'>
                        <TextInput label='User Name' name='username' value={user.username} placeholder='Enter the username' onChange={handleInputChange} />
                        <TextInput label='Email ID' name='email' value={user.email} placeholder='Enter the email id' onChange={handleInputChange} />
                        <SelectInput label="Company Access" name="companyAccess" value={user.companyAccess} onChange={handleInputChange}
                            options={[{ value: "", label: "Select the company" }, ...company.map((com) => ({ value: com.id, label: com.companyname }))]}
                        />

                    </div>
                    <div className='flex flex-col gap-3'>
                        <SelectInput label="Designation" name="role" value={user.role} onChange={handleInputChange}
                            options={[{ value: "", label: "Select the Designation" }, ...role.map((roles) => ({ value: roles.id, label: roles.role }))]}
                        />
                        <TextInput label='Password' type='password' name='password' value={user.password} placeholder='Enter the password' onChange={handleInputChange} />
                        <SelectInput label="Module Access" name="modulesAccess" value={user.modulesAccess} onChange={handleInputChange}
                            options={[{ value: "", label: "Select the modules" }, ...module.map((mod) => ({ value: mod.id, label:mod.modulename }))]}
                        />
                    </div>
                </div>
                <div className='flex justify-center items-center gap-5'>
                    <Button label='Cancel' onClick={handleCancel} className='bg-white border border-bordergray' />
                    <Button label='Save' type='submit' className='text-white bg-primary border border-yellow-500' />
                </div>
            </form>
        </div>
    )
}

export default CreateUser