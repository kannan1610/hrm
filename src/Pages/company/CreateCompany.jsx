import React, { useState, useEffect } from 'react';
import TextInput from '../../Components/TextInput';
import SelectInput from '../../Components/SelectInput';
import TextareaInput from '../../Components/TextareaInput';
import Button from '../../Components/Button';
import FileInput from '../../Components/FileInput';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { get,post } from "../../api";
import Swal from 'sweetalert2';

const CreateCompany = () => {
    const [state, setState] = useState([]);
    const [district, setDistrict] = useState([]);
    const [category, setCategory] = useState([]);
    const [imgpreview,setImgpreview] = useState();
    const [subcategory, setSubCategory] = useState([]);
    const [company, setCompany] = useState({
        companyName: '', branch: '', addressLine1: '', addressLine2: '', contactPerson: '',
        stakeholderName: '', username: '', pincode: '', contactNumber: '', stakeholderDetail: '',
        category: '', state: '', priority: '', assignedStaff: '', subcategory: '', district: '',
        establishmentType: '', notificationAlert: '', password: '', image: null,
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await get('/category');
            setCategory(response.data);
        };
        fetchCategory();

        const fetchSubCategory = async () => {
            const response = await get('/subcategories');
            setSubCategory(response.data);
        };
        fetchSubCategory();

        const fetchState = async () => {
            const response = await get('/states');
            setState(response.data);
        };
        fetchState();
    }, []);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setCompany((prev) => ({ ...prev, [name]: value }));

        if (name === 'state') {
            try {
                if (value) {
                    const response = await get(`/districts?stateId=${value}`);
                    setDistrict(response.data || []); // Safe handling of response data
                } else {
                    setDistrict([]);
                }
                setCompany((prev) => ({ ...prev, district: '' })); // Reset district when state changes
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistrict([]); // Reset to empty array on error
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Selected file:", file);
            setImgpreview(URL.createObjectURL(file));
            setCompany({ ...company, image: file });
            
        }
    };

    const handleCancel = () => {
        setCompany({
            companyName: '', branch: '', addressLine1: '', addressLine2: '', contactPerson: '',
            stakeholderName: '', username: '', pincode: '', contactNumber: '', stakeholderDetail: '',
            category: '', state: '', priority: '', assignedStaff: '', subcategory: '', district: '',
            establishmentType: '', notificationAlert: '', password: '', image: null,
        });
        navigate('/clientmanagement')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(company).forEach((key) => {
            formData.append(key, company[key]);
        });
        try {
            const response = await post("/company", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
        
            console.log("Response:", response.data);
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
    console.log(imgpreview);

    return (
        <div className="h-full p-5 shadow-lg">
            <h2 className="text-xl font-bold">Add New Company</h2>
            <form onSubmit={handleSubmit} className="pt-4 lg:p-0">
                <FileInput imageLabel="Company Logo" onImageChange={handleFileChange} imageSection={imgpreview} />
                <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 lg:gap-10">
                    <div className="flex flex-col gap-3">
                        <TextInput label="Company Name" name="companyName" value={company.companyName} placeholder="Enter company name" onChange={handleInputChange} />
                        <SelectInput
                            label="Category"
                            name="category"
                            value={company.category}
                            required
                            onChange={handleInputChange}
                            options={[{ value: "", label: "Select the category" }, ...category.map((cat) => ({ value: cat.id, label: cat.category_name }))]}
                        />
                        <SelectInput
                            label="State"
                            name="state"
                            value={company.state}
                            required
                            onChange={handleInputChange}
                            options={[{ value: "", label: "Select the State" }, ...state.map((sta) => ({ value: sta.id, label: sta.statename }))]}
                        />
                        <TextInput label="Branch" name="branch" value={company.branch} placeholder="Enter the branch" onChange={handleInputChange} />
                        <TextareaInput label="Address Line 2" name="addressLine2" value={company.addressLine2} placeholder="Enter address line 2" onChange={handleInputChange} />
                        <TextInput label="Contact Person" name="contactPerson" value={company.contactPerson} placeholder="Enter the contact person" onChange={handleInputChange} />
                        <SelectInput
                            label="Priority"
                            name="priority"
                            value={company.priority}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select priority" },
                                { value: "low", label: "Low" },
                                { value: "medium", label: "Medium" },
                                { value: "high", label: "High" },
                            ]}
                        />
                        <SelectInput
                            label="Assigned Staff"
                            name="assignedStaff"
                            value={company.assignedStaff}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select assigned staff" },
                                { value: "manager", label: "Manager" },
                                { value: "supervisor", label: "Supervisor" },
                            ]}
                        />
                        

<TextInput label='Stakehholder Name' name='stakeholderName' value={company.stakeholderName} placeholder='Enter the stakeholder name' onChange={handleInputChange} />
                        <TextInput label='User Name' name='username' value={company.username} placeholder='Enter the username' onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-col gap-3 lg:mt-20 pt-2">
                        <SelectInput
                            label="SubCategory"
                            name="subcategory"
                            value={company.subcategory || ""}
                            required
                            onChange={handleInputChange} 
                            options={[{ value: "", label: "Select the Subcategory" }, ...subcategory.map((subcat) => ({ value: subcat.id, label: subcat.subcategory_name }))]}
                        />
                        <SelectInput
                            label="District"
                            name="district"
                            value={company.district}
                            required
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select the District" },
                                ...district.map((dist) => ({ value: dist.id, label: dist.districtname }))
                            ]}
                        />
                        <TextareaInput label="Address Line 1" name="addressLine1" value={company.addressLine1} placeholder="Enter address line 1" onChange={handleInputChange} />
                        <TextInput label="Pincode" name="pincode" value={company.pincode} placeholder="Enter the pincode" onChange={handleInputChange} />
                        <TextInput label="Contact Number or Email ID" name="contactNumber" value={company.contactNumber} placeholder="Enter the contact number or email id" onChange={handleInputChange} />
                        <SelectInput
                            label="Establishment Type"
                            name="establishmentType"
                            value={company.establishmentType}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select establishment type" },
                                { value: "establishment A", label: "Establishment A" },
                                { value: "establishment B", label: "Establishment B" },
                                { value: "establishment C", label: "Establishment C" },
                            ]}
                        />
                        <SelectInput
                            label="Notification Alert"
                            name="notificationAlert"
                            value={company.notificationAlert}
                            onChange={handleInputChange}
                            options={[
                                { value: "", label: "Select notification alert" },
                                { value: "email", label: "Email" },
                                { value: "sms", label: "SMS" },
                                { value: "none", label: "None" },
                            ]}
                        />
                        <TextInput label="Stakeholder Detail with Email ID" name="stakeholderDetail" value={company.stakeholderDetail} placeholder="Enter the email id" onChange={handleInputChange} />
                        <TextInput label="Password" type="password" name="password" value={company.password} placeholder="Enter the password" onChange={handleInputChange} />
                    </div>
                </div>
                <div className="flex justify-center items-center gap-5">
                    <Button label="Cancel" onClick={handleCancel} className="bg-white border border-gray-800" />
                    <Button label="Save" type="submit" className="text-white bg-primary border border-yellow-500" />
                </div>
            </form>
        </div>
    );
};

export default CreateCompany;
