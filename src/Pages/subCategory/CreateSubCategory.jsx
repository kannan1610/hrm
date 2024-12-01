import React, { useState, useEffect } from 'react'
import TextInput from '../../Components/TextInput'
import Button from '../../Components/Button'
import SelectInput from '../../Components/SelectInput'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import axios from 'axios';
import { IoIosSearch } from "react-icons/io";
import DataTable from 'react-data-table-component';
import { PiCaretUpDownFill } from "react-icons/pi";
import { FaSliders } from 'react-icons/fa6';
import CustomPagination from '../../Components/CustomPagination';
import ActionMenu from '../../Components/category/ActionMenu';
import { IoCalendarOutline } from 'react-icons/io5';
import { get,remove,post } from '../../api';

const CreateSubCategory = () => {
    const navigate=useNavigate()
    const [category, setCategory] = useState([]);
    const [categoryid , setCategoryId] = useState();
    const [subCategory, setsubCategory] = useState()
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
    sno: true,
    natureOfCompliance: true,
    activity: true,
    nameOfForm: true,
    section: false,
    applicationLaw: true,
    typeOfAct: true,
    actualFilingFrequency: true,
    lastFilledDate: true,
    frequencyOfCompliance: true,
    action: true,
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectValue, setSelectValue] = useState({
    natureOfCompliance: '',
    nameOfForm: '',
    typeOfAct: '',
    frequencyOfCompliance: '',
  });
  const [showMenu, setShowMenu] = useState(false);
  const handleDelete = async (id) => {
    console.log("Attempting to delete ID:", id); // Debug log
  
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the Compliance.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D7B95F",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        console.log("Confirmed deletion for ID:", id); // Debug log
        await remove(`/compliance/${id}`); // Call the API
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Update state
        console.log("Successfully deleted ID:", id); // Debug log
        Swal.fire("Deleted!", "The Compliance has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting Compliance:", error);
        Swal.fire("Error!", "Failed to delete the Compliance.", "error");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('/compliance');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
    console.log(data);

  const handleCheckboxChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filteredData = data.filter((row) => {
    const searchText = search.toLowerCase();
    return (
      (selectValue.natureOfCompliance ? row.natureOfCompliance === selectValue.natureOfCompliance : true) &&
      (selectValue.nameOfForm ? row.nameOfForm === selectValue.nameOfForm : true) &&
      (selectValue.typeOfAct ? row.typeOfAct === selectValue.typeOfAct : true) &&
      (selectValue.frequencyOfCompliance ? row.frequencyOfCompliance === selectValue.frequencyOfCompliance : true) &&
      (
        row.natureOfCompliance?.toLowerCase().includes(searchText) ||
        row.activity?.toLowerCase().includes(searchText) ||
        row.nameOfForm?.toLowerCase().includes(searchText) ||
        row.typeOfAct?.toLowerCase().includes(searchText) ||
        row.applicationLaw?.toLowerCase().includes(searchText) ||
        row.section?.toLowerCase().includes(searchText) ||
        row.actualFilingFrequency?.toLowerCase().includes(searchText) ||
        row.lastFilledDate?.toLowerCase().includes(searchText) ||
        row.frequencyOfCompliance?.toLowerCase().includes(searchText)
      )
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => setCurrentPage(newPage);

  const customStyles = {
    rows: { style: { minHeight: '55px' } },
    headCells: { style: { backgroundColor: '#000', color: '#fff' } },
    cells: { style: { overflowWrap: 'break-word' } },
  };
    useEffect(() => {
        const fetchCategory = async () => {
            const response = await get('/category');
            setCategory(response.data);
        };
        fetchCategory();
    }, []);

    console.log(categoryid,subCategory);
    const handleInputChange = (e) => {
        setsubCategory(e.target.value)
    }

    const handleCancel = () => {
        setsubCategory('')
        navigate('/subcatlist')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await post('/subcategory', { subCategory, category_id: categoryid });
            console.log('Subcategory added:', response.data);
            setCategory('');
            setCategoryId('');
            navigate('/subcatlist');
            Swal.fire({
        
                icon: 'success',
                title: 'Success!',
                text: 'Subcategory Created successfully!',
              }).then(() => {
                navigate('/subcatlist');
              });
        } catch (error) {
            console.error('Error adding subcategory:', error);
            Swal.fire({
        
                icon: 'error',
                title: 'Failed!',
                text: 'Subcategory Cannot Created successfully!',
              });
        }
    };
    return (
        <div className='h-full p-5 shadow-lg'>
            <div className="flex items-center justify-between">
                <h2 className='text-xl font-bold'>Create Sub Category</h2>
                <Link to="/subcatlist"><button className="w-36 py-1.5 bg-primary text-white rounded cursor-pointer flex items-center justify-center gap-2">
                    Category List
                </button> </Link>
            </div>
            <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-10'>
                <SelectInput label="Category" name="category" value={categoryid || "" } required onChange={(e) => setCategoryId(e.target.value)}
            options={[
                        { value: "", label: "Select the category" },
                        ...category.map((cat) => ({
                        value: cat.id,
                        label: cat.category_name,
                        })),
                        ]} />
                    <TextInput label='Sub Category' name='subCategory' value={subCategory || "" } placeholder='Enter the sub category' onChange={handleInputChange} />
                </div>
                 <div className='py-6 flex flex-wrap gap-4'>
        {Object.keys(selectValue).map((key) => (
          filters[key] && (
            <select
              key={key}
              className='w-full lg:w-40 bg-selectbg py-2 px-4 rounded-md border border-bordergray'
              value={selectValue[key]}
              onChange={(e) => setSelectValue({ ...selectValue, [key]: e.target.value })}
            >
              <option value="">{key}</option>
              {[...new Set(data.map((item) => item[key]))].map((value, index) => (
                <option key={index} value={value}>{value}</option>
              ))}
            </select>
          )
        ))}
        <span className='w-full lg:w-40 relative'>
          <input
            type='text'
            className='w-full py-1.5 pl-8 border border-bordergray rounded-md'
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoIosSearch className='absolute top-2 left-2' size={20} />
        </span>
        <span className='relative'>
          <FaSliders size={35} className="p-1.5 bg-white border border-gray-400 rounded-md cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
          <div className='absolute z-30 top-10 lg:'>
            {showMenu &&
              (
                <div className='border border-bordergray rounded-md p-4 w-56 bg-white shadow-md'>
                  <label >
                    <input type='checkbox' checked={filters.sno} onChange={() => handleCheckboxChange('sno')} className='me-3 accent-black' />
                    Sno
                  </label><br />
                  <label >
                    <input type='checkbox' checked={filters.natureofactivity} onChange={() => handleCheckboxChange('natureofactivity')} className='me-3 accent-black' />
                    Nature of Activity
                  </label><br />
                  <label >
                    <input type='checkbox' checked={filters.activity} onChange={() => handleCheckboxChange('activity')} className='me-3 accent-black' />
                    Activity
                  </label><br />
                  <label>
                    <input type='checkbox' checked={filters.formname} onChange={() => handleCheckboxChange('formname')} className='me-3 accent-black' />
                    Name of the Form
                  </label><br />
                  <label>
                    <input type='checkbox' checked={filters.section} onChange={() => handleCheckboxChange('section')} className='me-3 accent-black' />
                    Section
                  </label><br />
                  <label >
                    <input type='checkbox' checked={filters.applicablelaw} onChange={() => handleCheckboxChange('applicablelaw')} className='me-3 accent-black' />
                    Applicable Law
                  </label><br />
                  <label>
                    <input type='checkbox' checked={filters.acttype} onChange={() => handleCheckboxChange('acttype')} className='me-3 accent-black' />
                    Type of Act
                  </label><br />
                  <label className='text-nowrap' >
                    <input type='checkbox' checked={filters.actualfilling} onChange={() => handleCheckboxChange('actualfilling')} className='me-3 accent-black' />
                    Actual Filling Frequency
                  </label><br />

                  <label >
                    <input type='checkbox' checked={filters.lastfill} onChange={() => handleCheckboxChange('lastfill')} className='me-3 accent-black' />
                    Last Filed Date
                  </label><br />
                  <label>
                    <input type='checkbox' checked={filters.frequency} onChange={() => handleCheckboxChange('frequency')} className='me-3 accent-black' />
                    Priority
                  </label><br />

                </div>
              )}
          </div>
        </span>
      </div>

      <DataTable
        columns={[
          { name: 'SNO', selector: (_, index) => index + 1, sortable: true, omit: !filters.sno, width: '100px' },
          { name: 'Nature Of Activity', selector: (row) => row.natureOfCompliance, sortable: true, omit: !filters.natureOfCompliance },
          { name: 'Activity', selector: (row) => row.activity, sortable: true, omit: !filters.activity },
          { name: 'Name of the Form', selector: (row) => row.nameOfForm, sortable: true, omit: !filters.nameOfForm, grow: 2 },
          { name: 'Section', selector: (row) => row.section, sortable: true, omit: !filters.section },
          { name: 'Applicable Law', selector: (row) => row.applicationLaborAct, sortable: true, omit: !filters.applicationLaw, grow: 3 },
          { name: 'Type of Act', selector: (row) => row.typeOfAct, sortable: true, omit: !filters.typeOfAct, width: '120px' },
          { name: 'Actual Filing Frequency', selector: (row) => row.frequencyOfCompliance, sortable: true, omit: !filters.actualFilingFrequency },
          {
            name: 'Last Filed Date',
            cell: (row) => (
              <div className='flex items-center'>
                <p>{row.lastFilledDate}</p>
                <IoCalendarOutline className='text-black' />
              </div>
            ),
            sortable: true,
            omit: !filters.lastFilledDate,
          },
          { name: 'Filling Frequency', selector: (row) => row.dueDate, sortable: true, omit: !filters.frequencyOfCompliance },
          {
            name: "Actions",
            center: true,
            cell: (row) => (
              <ActionMenu
                handleDelete={() => handleDelete(row.id)}
                handleEdit={() => handleEdit(row.id)} // Implement handleEdit
                handleView={() => handleView(row.id)} // Implement handleView
              />
            ),
          },
        ]}
        data={paginatedData}
        pagination={false}
        responsive
        highlightOnHover
        customStyles={customStyles}
        sortIcon={<PiCaretUpDownFill />}
      />

      <div className='py-2 flex justify-between items-center'>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className='p-2 rounded w-24'
        >
          <option value={10}>Show 10</option>
          <option value={20}>Show 20</option>
          <option value={30}>Show 30</option>
        </select>
        <CustomPagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
            <form onSubmit={handleSubmit} className='py-10 flex flex-col gap-80'>
                <div className='flex justify-center items-center gap-5'>
                    <Button label='Cancel' onClick={handleCancel} className='bg-white border border-gray-800' />
                    <Button label='Save' type='submit' className='text-white bg-primary border border-primary' />
                </div>
            </form>
        </div>
    )
}

export default CreateSubCategory