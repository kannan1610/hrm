import React, { useState, useEffect } from 'react'
import TextInput from '../../Components/TextInput'
import SelectInput from '../../Components/SelectInput'
import TextareaInput from '../../Components/TextareaInput'
import Button from '../../Components/Button'
import FileInput from '../../Components/FileInput'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post } from '../../api'
import Swal from "sweetalert2";
import axios from 'axios'

const CreateBranch = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [companyname, setCompany] = useState([]);
    const [category, setCategory] = useState([]);
    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [imgPreview, setImgPreview] = useState();
    const [subcategory, setSubCategory] = useState([]);
    const [branch, setBranch] = useState({
        company:'',branch: '', addressLine1: '', addressLine2: '', contactPerson: '', stakeholderName: '',
        username: '', pincode: '', contactNumber: '', stakeholderDetail: '', category: '',
        state: '', priority: '', assignedStaff: '', subcategory: '', district: '',
        establishmentType: '', notificationAlert: '', password: '', companyImage: null,
    });
    branch.company = id;
    console.log(branch);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const categoryResponse = await get('/category');
                setCategory(categoryResponse.data);

                const subcategoryResponse = await get('/subcategories');
                setSubCategory(subcategoryResponse.data);

                const stateResponse = await get('/states');
                setState(stateResponse.data);

                // Fetch company name if available (assuming the endpoint works for this)
                const branchResponse = await get(`/branchlist?company_id=${id}`);
                if (branchResponse.data && branchResponse.data.length > 0) {
                    setCompany(branchResponse.data[0].companyname);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchInitialData();
    }, [id]);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setBranch(prev => ({ ...prev, [name]: value }));

        if (name === 'state') {
            try {
                if (value) {
                    const districtResponse = await get(`/districts?stateId=${value}`);
                    setDistrict(districtResponse.data || []);
                } else {
                    setDistrict([]);
                }
                setBranch(prev => ({ ...prev, district: '' })); // Reset district when state changes
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistrict([]); // Reset to empty array on error
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgPreview(URL.createObjectURL(file));
            setBranch(prev => ({ ...branch, companyImage: file }));
        }
    };

    const handleCancel = () => {
        setBranch({
            company :'',branch: '', addressLine1: '', addressLine2: '', contactPerson: '', stakeholderName: '',
            username: '', pincode: '', contactNumber: '', stakeholderDetail: '', category: '',
            state: '', priority: '', assignedStaff: '', subcategory: '', district: '',
            establishmentType: '', notificationAlert: '', password: '', companyImage: null,
        });
        navigate(`/clientbranchmanagement/${id}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(branch).forEach((key) => {
            formData.append(key, branch[key]);
        });

        try {
            const response = await post("/branch", formData,{id},{
                headers: { "Content-Type": "multipart/form-data" },
            });

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Company created successfully!",
            }).then(() => navigate("/clientmanagement"));
        } catch (error) {
            console.error("Submit Error:", error);
            Swal.fire({
                icon: "error",
                title: "Failed!",
                text: "Company record creation failed.",
            });
        }
    };

    return (
        <div className='h-full p-5 shadow-lg'>
            <h2 className='text-xl font-bold'>Add Branches</h2>
            <form onSubmit={handleSubmit} className='pt-4 lg:p-0'>
                <FileInput imageLabel={companyname} name="companyImage" onImageChange={handleFileChange} imageSection={imgPreview} />
                <div className='grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 lg:gap-10'>
                    <div className='flex flex-col gap-3'>
                        <SelectInput
                            label="Category"
                            name="category"
                            value={branch.category}
                            required
                            onChange={handleInputChange}
                            options={[{ value: "", label: "Select the category" }, ...category.map((cat) => ({ value: cat.id, label: cat.category_name }))]}
                        />
                        <SelectInput
                            label="State"
                            name="state"
                            value={branch.state}
                            required
                            onChange={handleInputChange}
                            options={[{ value: "", label: "Select the State" }, ...state.map((sta) => ({ value: sta.id, label: sta.statename }))]}
                        />
                        <TextInput label='Branch' name='branch' value={branch.branch} placeholder='Enter the branch name' onChange={handleInputChange} />
                        <TextareaInput label='Address Line 2' name='addressLine2' value={branch.addressLine2} placeholder='Enter address line 2' onChange={handleInputChange} />
                        <TextInput label='Contact Person' name='contactPerson' value={branch.contactPerson} placeholder='Enter the contact person' onChange={handleInputChange} />
                        <SelectInput label="Priority" name="priority" value={branch.priority} onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select priority" },
                                { value: "low", label: "Low" },
                                { value: "medium", label: "Medium" },
                                { value: "high", label: "High" },
                            ]}
                        />
                        <SelectInput label="Assigned Staff" name="assignedStaff" value={branch.assignedStaff} onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select assigned staff" },
                                { value: "manager", label: "Manager" },
                                { value: "supervisor", label: "Supervisor" },
                            ]}
                        />
                        <TextInput label='Stakeholder Name' name='stakeholderName' value={branch.stakeholderName} placeholder='Enter the stakeholder name' onChange={handleInputChange} />
                        <TextInput label='Username' name='username' value={branch.username} placeholder='Enter the username' onChange={handleInputChange} />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <SelectInput
                            label="SubCategory"
                            name="subcategory"
                            value={branch.subcategory || ""}
                            required
                            onChange={handleInputChange}
                            options={[{ value: "", label: "Select the Subcategory" }, ...subcategory.map((subcat) => ({ value: subcat.id, label: subcat.subcategory_name }))]}
                        />
                        <SelectInput
                            label="District"
                            name="district"
                            value={branch.district}
                            required
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select the District" },
                                ...district.map((dist) => ({ value: dist.id, label: dist.districtname }))
                            ]}
                        />
                        <TextareaInput label='Address Line 1' name='addressLine1' value={branch.addressLine1} placeholder='Enter address line 1' onChange={handleInputChange} />
                        <TextInput label='Pincode' name='pincode' value={branch.pincode} placeholder='Enter the pincode' onChange={handleInputChange} />
                        <TextInput label='Contact Number or Email ID' name='contactNumber' value={branch.contactNumber} placeholder='Enter contact number or email ID' onChange={handleInputChange} />
                        <SelectInput label="Establishment Type" name="establishmentType" value={branch.establishmentType} onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select establishment type" },
                                { value: "establishment A", label: "Establishment A" },
                                { value: "establishment B", label: "Establishment B" },
                                { value: "establishment C", label: "Establishment C" },
                            ]}
                        />
                        <SelectInput label="Notification Alert" name="notificationAlert" value={branch.notificationAlert} onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select notification alert" },
                                { value: "email", label: "Email" },
                                { value: "sms", label: "SMS" },
                                { value: "none", label: "None" },
                            ]}
                        />
                        <TextInput label='Stakeholder Detail with Email ID' name='stakeholderDetail' value={branch.stakeholderDetail} placeholder='Enter email id' onChange={handleInputChange} />
                        <TextInput label='Password' type='password' name='password' value={branch.password} placeholder='Enter the password' onChange={handleInputChange} />
                    </div>
                </div>
                <div className='flex justify-center items-center gap-5'>
                    <Button label='Cancel' onClick={handleCancel} className='bg-white border border-gray-800' />
                    <Button label='Save' type='submit' className='text-white bg-primary border border-yellow-500' />
                </div>
            </form>
        </div>
    )
}

export default CreateBranch;
