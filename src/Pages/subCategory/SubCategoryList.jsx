import React, { useState,useEffect } from 'react'
import { HiOutlineDownload } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import DataTable from 'react-data-table-component';
import { PiCaretUpDownFill } from "react-icons/pi";
import ActionMenu from "../../Components/category/ActionMenu";
import data from '../../Components/subCategory/SubCatListData';
import { Link,useNavigate } from 'react-router-dom';
import { get,remove } from '../../api';
import axios from 'axios';
import Swal from "sweetalert2";
const Sublist = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectValue,setSelectValue]=useState({subcategory:"",category:""})
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('/subcategory'); // Replace with your correct API endpoint
        console.log('Fetched data:', response.data); // Log the data to check
        setData(response.data);  // Set data to state
        setFilteredData(response.data);  // Initialize filtered data
      } catch (error) {
        console.error('Error fetching data:', error);  // Error handling
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filter based on search term if search is provided
    const filterData = data.filter((row) =>
      row.subcategory_name && row.subcategory_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filterData);
  }, [search, data]);
  useEffect(() => {
    const fetchCategory = async () => {
        const response = await get('/category');
        setCategory(response.data);
    };
    fetchCategory();
}, []);

const handleEdit = (id) => {
  navigate(`/viewsubcatlist/${id}`); // Redirect to edit page
};

const columns =[
   
  {
    name:'S NO',
    selector: (row, index) => index + 1,
    sortable: false,
  },
  {
    name:'Sub Category',
    selector: row=>row.subcategory_name,
    sortable: true,
    grow:2,
  },
  {
    name:'Category',
    selector: row=>row.category_name,
    sortable: true,
    grow:2,
  },
  {
    name: "Actions",
    center: true,
    cell: (row) => (
      <ActionMenu
        handleDelete={() => handleDelete(row.id)}
        handleEdit={() => handleEdit(row.id)}
        handleView={() => handleView(row.id)}
      />
    ),
  },
];


console.log("Datas are : ",selectValue.subcategory,selectValue.category)

  const filter = data.filter((row) => {
    return (
      (selectValue.subcategory ? row.subcategory_name === selectValue.subcategory : true) &&
      (selectValue.category ? row.category_name === selectValue.category : true) &&
      (row.subcategory_name?.toLowerCase().includes(search.toLowerCase()) || 
       row.category_name?.toLowerCase().includes(search.toLowerCase()))
    );
    
  });
  

  const customStyles = {
    rows: {
      style: {
        minHeight: '55px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '30px',
        paddingRight: '60px',
        backgroundColor: '#000',
        color: '#fff',
        fontSize:'14px'
      }
    },
    cells: {
      style: {
        paddingLeft: '30px',
        paddingRight: '80px',
        fontSize:'14px'
      }
    },
  }
  const downloadCSV = () => {
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Factory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

   const handleDelete = async (id) => {
    console.log("Attempting to delete ID:", id); // Debug log
  
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the category.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D7B95F",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        console.log("Confirmed deletion for ID:", id); // Debug log
        await remove(`/subcategory/${id}`); // Call the API
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Update state
        console.log("Successfully deleted ID:", id); // Debug log
        Swal.fire("Deleted!", "The subcategory has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire("Error!", "Failed to delete the category.", "error");
      }
    }
  };

console.log(filter);

  return (
    <div className='p-5 mt-5 '>
      <div className='flex flex-col justify-center gap-2 items-start lg:flex-row lg:items-center lg:justify-between'>
        <h2 className='font-semibold text-lg'>Sub Category List</h2>
        <div className='flex gap-3'>
          <button><HiOutlineDownload onClick={downloadCSV} className='w-9 h-9 p-2 rounded-full bg-primary text-light ' /></button>
          <Link to="/createsubcategory"><button className='py-2 w-44 lg:w-44 rounded-md text-white bg-primary' >Create Sub Category</button> </Link>
        </div>
      </div>

      <div className='py-6 flex justify-start items-center flex-wrap gap-6 mb-4'>
      <select className='w-full lg:w-56 bg-selectbg py-2 px-4 rounded-md border border-bordergray' value={selectValue.subcategory} onChange={(e) => setSelectValue({ ...selectValue, subcategory: e.target.value })}>
  <option value="">Sub Category</option>
  {data.map((item, index) => (
    <option key={item.id || index} value={item.subcategory_name}>{item.subcategory_name}</option>
  ))}
</select>

<select className='w-full lg:w-56 bg-selectbg py-2 px-4 rounded-md border border-bordergray' value={selectValue.category} onChange={(e) => setSelectValue({ ...selectValue, category: e.target.value })}>
  <option value="">Category</option>
  {category.map((item, index) => (
    <option key={item.id || index} value={item.category_name}>{item.category_name}</option>
  ))}
</select>

        <span className='w-full lg:w-56 bg-selectbg relative'>
          <input type='text' className=' focus-visible focus-visible:outline-none w-full py-1.5 ps-8 border border-bordergray rounded-md ' placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
          <IoIosSearch className='  absolute top-2.5 left-2' size={18} />
        </span>
      </div>


      <DataTable
      className='pb-10'
        columns={columns} sortIcon={<PiCaretUpDownFill/>}
        data={filter}
        selectableRows
        highlightOnHover
        customStyles={customStyles} >
      </DataTable>

    </div>
  )
}
export default Sublist
