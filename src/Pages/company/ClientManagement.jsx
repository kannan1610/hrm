import React, { useEffect, useState } from 'react';
import { CiBoxList, CiGrid41, CiSearch } from 'react-icons/ci';
import { GoDownload, GoPencil } from 'react-icons/go';
import { MdAdd } from "react-icons/md";
import logo from '../../Images/sky.jpg';
import { IoNotificationsOffOutline, IoTrashOutline } from 'react-icons/io5';
import { AiOutlineFileSearch, AiOutlineMail } from 'react-icons/ai';
import DataTable from 'react-data-table-component';
import ActionMenu from "../../Components/category/ActionMenu";
import { Link, useNavigate } from 'react-router-dom';
import { get,remove } from '../../api';
import Swal from "sweetalert2";

const ClientManagement = () => {
    const navigate = useNavigate();

    const [Data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ company: "" });
    const [filterData, setFilterData] = useState([]);
    const [view, setView] = useState('grid');

    const columns = [
        {
            name: "S.No",
            selector: (row, index) => index + 1,
            sortable: true,
            width: '90px',
        },
        {
            name: "Company",
            cell: row => (
                <span className='flex items-center gap-4'>
                    <img src={'logo'} className='w-10 h-10 rounded-full' alt={row.logo} />
                    <p className='text-wrap'>{row.companyname}</p>
                </span>
            ),
            sortable: true,
            width: '300px',
        },
        {
            name: "Branch",
            selector: row => row.branch,
            sortable: true,
            width: '200px',
            center: true,
        },
        {
            name: "Level",
            selector: row => row.priority,
            sortable: true,
            center: true,
        },
        {
            name: "Action",
            cell: row => <ActionMenu
            handleDelete={() => handleDelete(row.id)}
            handleEdit={() => handleEdit(row.id)}
            handleView={() => handleView(row.id)}
          />,
            ignoreClick: true,
            center: true,
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#000000',
                color: 'white',
                fontSize: '14px',
                paddingLeft: '30px',
            },
        },
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get('/company'); // API call to fetch company data
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    console.log(Data);
    // Filter and search data
    useEffect(() => {
        const filtered = Data.filter(data => {
            const companyMatch = filter.company ? data.companyname === filter.company : true;
            const searchMatch =
                data.companyname?.toLowerCase().includes(search.toLowerCase()) ||
                data.branch?.toLowerCase().includes(search.toLowerCase()) ||
                data.priority?.toLowerCase().includes(search.toLowerCase());

            return companyMatch && searchMatch;
        });
        setFilterData(filtered);
    }, [Data, filter, search]);

    // Navigate to branch management page
    const branch = (id) => {
        navigate(`/clientbranchmanagement/${id}`);
    };
    const handleDelete = async (id) => {
        console.log("Attempting to delete ID:", id); // Debug log
      
        const confirmDelete = await Swal.fire({
          title: "Are you sure?",
          text: "This action will permanently delete the company.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#D7B95F",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
        });
      
        if (confirmDelete.isConfirmed) {
          try {
            console.log("Confirmed deletion for ID:", id); // Debug log
            await remove(`/company/${id}`); // Call the API
            setData((prevData) => prevData.filter((item) => item.id !== id)); // Update state
            console.log("Successfully deleted ID:", id); // Debug log
            Swal.fire("Deleted!", "The Company has been deleted.", "success");
          } catch (error) {
            console.error("Error deleting category:", error);
            Swal.fire("Error!", "Failed to delete the company.", "error");
          }
        }
      };


    const handleEdit = (id) => {
        navigate(`/updatecompany/${id}`); // Redirect to edit page
      };
      
    return (
        <div className='h-screen'>
            {/* Header */}
            <div className="flex flex-col justify-center gap-2 items-start lg:flex-row lg:items-center lg:justify-between">
                <h1 className='font-bold text-lg mt-3 ms-4'>Client Management ({Data.length})</h1>
                <div className='flex justify-evenly items-center gap-3 me-5 p-3'>
                    <GoDownload
                        className='rounded-full bg-primary text-white h-8 w-8 p-1.5'
                        size={15}
                        onClick={() => window.print()}
                    />
                    <Link to='/company' className='flex rounded-md bg-primary text-white h-8 w-28 justify-center items-center'>
                        <MdAdd size={22} />Add Client
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className='flex my-3 justify-between gap-3 p-2 ms-3 items-center flex-wrap'>
                <div className='flex items-center gap-3 flex-wrap'>
                    <select
                        className='bg-white rounded-lg border border-bordergray px-4 h-9 w-full lg:w-44'
                        value={filter.company}
                        onChange={e => setFilter({ ...filter, company: e.target.value })}
                    >
                        <option value="">Company</option>
                        {Data.map((item, index) => (
                            <option key={index} value={item.id}>{item.companyname}</option>
                        ))}
                    </select>
                    <div className='relative w-full lg:w-44'>
                        <input
                            type="text"
                            className='bg-white rounded-lg border border-bordergray w-full lg:w-44 py-1.5 ps-8'
                            placeholder='Search'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <CiSearch className='absolute top-1.5 left-2' size={23} />
                    </div>
                </div>
                <div className='flex items-start gap-2 me-6'>
                    <button
                        onClick={() => setView('grid')}
                        className={`${view === 'grid' ? 'bg-black text-white' : 'bg-white text-black'} p-2.5 border border-gray-400 rounded-md`}
                    >
                        <CiGrid41 size={17} />
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`${view === 'list' ? 'bg-black text-white' : 'bg-white text-black'} p-2.5 border border-gray-400 rounded-md`}
                    >
                        <CiBoxList size={17} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {view === 'list' ? (
                <div className='w-full p-5'>
                    <DataTable
                        columns={columns}
                        data={filterData}
                        customStyles={customStyles}
                        fixedHeader
                        selectableRows
                    />
                </div>
            ) : (
                <div className='p-4'>
                    <div className="flex justify-start gap-10 flex-wrap w-full">
    {filterData.map((data, index) => (
        <div
            key={index}
            className='flex items-center border border-bordergray rounded-md bg-white w-min'
        >
            <span
                className={`w-8 h-full ${
                    data.priority === 'high'
                        ? 'bg-highBlue'
                        : data.priority === 'medium'
                        ? 'bg-medgreen'
                        : data.priority === 'low'
                        ? 'bg-lowOrange'
                        : 'bg-gray-300'
                } text-center text-white flex items-center justify-center rounded-s-md`}
            >
                <p className='transform -rotate-90 font-bold'>{(data.priority || 'N/A').toUpperCase()}</p>
            </span>
            <div className='p-3'>
                <div className='flex justify-start gap-4 items-center'>
                    <img src={logo} className='rounded-full h-16 w-16' alt="Company Logo" />
                    <div onClick={() => branch(data.id)}>
                        <h5 className='font-semibold'>{data.companyname}</h5>
                        <p>Branches - {data.branch}</p>
                    </div>
                </div>
                <div className='flex gap-3 border-t py-2 w-full mt-3 justify-center'>
                    <button className='p-2.5 bg-primary text-white rounded-full'><IoNotificationsOffOutline /></button>
                    <button className='p-2.5 bg-primary text-white rounded-full'><AiOutlineMail /></button>
                    <button className='p-2.5 bg-primary text-white rounded-full' onClick={() => handleEdit(data.id)} ><GoPencil /></button>
                    <button className='p-2.5 bg-primary text-white rounded-full' onClick={() => handleDelete(data.id)}><IoTrashOutline /></button>
                    <button className='p-2.5 bg-primary text-white rounded-full'><AiOutlineFileSearch /></button>
                </div>
            </div>
        </div>
    ))}
</div>

                </div>
            )}
        </div>
    );
};

export default ClientManagement;
