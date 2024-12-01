import React, { useState, useEffect } from 'react';
import { HiOutlineDownload } from "react-icons/hi";
import DataTable from 'react-data-table-component';
import { IoIosSearch } from "react-icons/io";
import { PiCaretUpDownFill } from "react-icons/pi";
import { Link, useNavigate  } from 'react-router-dom';
import Swal from "sweetalert2";
import { get, remove } from "../../api";  // Assuming `remove` is defined in your API functions
import ActionMenu from "../../Components/category/ActionMenu";
import axios from 'axios';

const NatureComplianceList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filterData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('/natureofcompliance'); // Replace with your correct API endpoint
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
    const filtered = data.filter((row) =>
      row.nature && row.nature.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);
  const handleEdit = (id) => {
    navigate(`/updatenatureofcompliance/${id}`); // Redirect to edit page
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete ID:", id); // Debug log
  
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the Nature for Compliance.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D7B95F",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        console.log("Confirmed deletion for ID:", id); // Debug log
        await remove(`/natureofcompliance/${id}`); // Call the API
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Update state
        console.log("Successfully deleted ID:", id); // Debug log
        Swal.fire("Deleted!", "The Nature of Compliance has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting Nature of Compliance:", error);
        Swal.fire("Error!", "Failed to delete the Nature of Compliance.", "error");
      }
    }
  };
  const downloadCSV = () => {
    const csv = filterData.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'NatureCompliance.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    { name: "Nature of Compliance", selector: (row) => row.nature, sortable: true },
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
  ];

  return (
    <>
      <div className='flex flex-col justify-center gap-2 items-start lg:flex-row m-5 lg:items-center lg:justify-between'>
        <h2 className='font-semibold text-lg'>Nature Of Compliance List</h2>
        <div className='flex gap-3'>
          <HiOutlineDownload onClick={downloadCSV} className='w-9 h-9 p-2 rounded-full bg-primary text-white' />
          <Link to="/createnaturecompliance"><button className='py-2 w-56 rounded-md text-white bg-primary'>Create Nature Of Compliance</button></Link>
        </div>
      </div>

      <div className='relative -z-50 items-center'>
        <input type='text' className='m-5 focus-visible focus-visible:outline-none w-44 mt-2 bg-white border text-md text-black border-bordergray px-7 py-2 rounded-md placeholder:text-black' placeholder='Search' onChange={(e) => setSearch(e.target.value)} />
        <div className='absolute inset-y-0 top-4 left-6 text-gray'>
          <IoIosSearch size={25} className='text-slate-300' />
        </div>
      </div>

      <div className='p-5'>
        <DataTable
          className='pb-10'
          columns={columns}
          selectableRows
          data={filterData}
          highlightOnHover
          sortIcon={<PiCaretUpDownFill style={{ color: 'white' }} />}
          customStyles={{
            rows: {
              style: {
                minHeight: '60px',
              },
            },
            headCells: {
              style: {
                paddingLeft: '0px',
                paddingRight: '60px',
                backgroundColor: '#000',
                color: '#fff',
                fontSize: '14px',
              },
            },
            cells: {
              style: {
                paddingLeft: '0px',
                paddingRight: '80px',
                fontSize: '14px',
              },
            },
          }}
        />
      </div>
    </>
  );
}

export default NatureComplianceList;
