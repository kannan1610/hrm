import { LuDelete } from "react-icons/lu";
import { LuLayoutGrid } from "react-icons/lu";
import { FaBell, FaListUl } from "react-icons/fa6";
import React, { useState,useEffect } from 'react'
import { LuDownload } from "react-icons/lu";
import { Data } from "./Data";
import { IoIosAdd, IoIosSearch } from "react-icons/io";
// import { Columns } from "./Columns";
import ActionMenu from "../../Components/category/ActionMenu";
import DataTable from "react-data-table-component";
import CustomPagination from "./CustomPagination";
import { Link } from "react-router-dom";
import { HiViewList } from "react-icons/hi";
import { GoDownload } from "react-icons/go";
import { get,remove } from "../../api";
import CompanyIcon from "./CompanyIcon";
import Swal from "sweetalert2";
import UserIcon from "./UserIcon";

const UserList = () => {
    const [user,setUser] = useState([]);
    const [search, setSearch] = useState("")
    const [view, setView] = useState('list')
    const [tableData] = useState(Data)
    const [role,setRole] = useState([])
    const [module,setModule]=useState([])
    const [company,setCompany]=useState([])
    const [filter, setFilter] = useState({
        company: '', role: '', modules: '',
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(30)
    // const handleInputChange = (e) => {
    //     const { name, value } = e.target
    //     setFilter({ ...filter, [name]: value, })
    // }
    const handleListView = () => {
        if (view === 'grid') {
            setView('list')
        }
    }
    const handleGridView = () => {
        if (view === 'list') {
            setView('grid')
        }
    }
    var filterData = user.filter((item) => {
        return (
            (filter.company ? item.company === filter.company : true) &&
            (filter.role ? item.role === filter.role : true) &&
            (filter.modules ? item.module === filter.modules : true) && (
                (item.company && item.company.toLowerCase().includes(search.toLowerCase())) ||
                (item.role && item.role.toLowerCase().includes(search.toLowerCase())) ||
                (item.module && item.module.toLowerCase().includes(search.toLowerCase()))
            )
        );
    });
    
    console.log("Data",user);    
    const customStyles = {
        rows: {
            style: {
                minHeight: '20px',
            },
        },
        headCells: {
            style: {
                backgroundColor: '#000',
                color: '#fff',
                fontSize: '14px',
                padding:'0px 10px'
            },
        },
        cells: {
            style: {
                borderBottom: '1px solid rgba(0,0,0,0.15)',
                padding: '10px 10px',
                fontSize: '14px',
            },
        },
    };
    const totalPages = Math.ceil(filterData.length / itemsPerPage)
    var filterData = filterData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await get('/user');
            setUser(response.data);
            setFilter(response.data);
        };
        fetchUser();

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
        const fetchCompany = async () => {
            const response = await get('/company');
            setCompany(response.data);
        };
        fetchCompany();
    }, []);
    console.log("User",user);
    const Columns = [
        {
            name: 'Sno',
            selector: (row,index) => index+1,
            sortable: true,
            left:true,
            width: '100px',
        },
        {
            name: 'User',
            selector: (row) => (<UserIcon user={row.username} />),
            sortable: true,
        },
        {
            name: 'Designation',
            selector: (row) => row.role,
            sortable: true,
        },
        {
            name: 'Company',
            selector: (row) => <CompanyIcon row={row.company} />,
            sortable: true,
        },
        {
            name: 'Modules',
            selector: (row) => row.module,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => <ActionMenu
            handleDelete={() => handleDelete(row.id)}
            handleEdit={() => handleEdit(row.id)}
            handleView={() => handleView(row.id)}
          />,
            ignoreClick: true,
            allowOverflow: true,
            right: true,
            width: '100px',
        },
    ]
    


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
            await remove(`/user/${id}`); // Call the API
            setData((prevData) => prevData.filter((item) => item.id !== id)); // Update state
            console.log("Successfully deleted ID:", id); // Debug log
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          } catch (error) {
            console.error("Error deleting user:", error);
            Swal.fire("Error!", "Failed to delete the user.", "error");
          }
        }
      };
    return (
        <div className='h-full w-full p-5 shadow-lg'>
            <div className="flex flex-col justify-center gap-2 items-start lg:flex-row mb-6 lg:items-center lg:justify-between">
                <h2 className='text-xl font-bold'>User Management({filterData.length})</h2>
                <div className="flex items-center justify-center gap-2 lg:gap-4">
                    <LuDownload className="bg-primary text-white rounded-full p-2 cursor-pointer" size={35} />
                    <Link to='/user' className="w-32 py-1.5 bg-primary text-white rounded cursor-pointer flex items-center justify-center gap-2">
                        <IoIosAdd /><span>Add user</span>
                    </Link>
                </div>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-2 lg:gap:3">
                <div className="flex items-center gap-4 flex-wrap">
                    <select onChange={(e) => setFilter({ ...filter, company: e.target.value })} value={filter.company} className='w-full lg:w-44 bg-white border border-bordergray py-2 px-4 rounded '>
                        <option value="">Company</option>
                        {company.map((data) => <option value={data.id}>{data.companyname}</option>)}
                    </select>
                    <select onChange={(e) => setFilter({ ...filter, role: e.target.value })} value={filter.role} className='w-full lg:w-44 bg-white border border-bordergray py-2 px-4 rounded '>
                        <option value="">Designation</option>
                        {role.map((data) => <option value={data.id}>{data.role}</option>)}
                    </select>
                    <select onChange={(e) => setFilter({ ...filter, modules: e.target.value })} value={filter.modules} className='w-full lg:w-44 bg-white border border-bordergray py-2 px-4 rounded '>
                        <option value="">Modules</option>
                        {module.map((data) => <option value={data.id}>{data.modulename}</option>)}
                    </select>
                    <span className='w-full lg:w-44 relative'>
                        <input type='text' className='w-full focus-visible focus-visible:outline-none py-2 ps-8 border border-bordergray rounded placeholder:text-black' placeholder='Search' onChange={(e) => setSearch(e.target.value)} value={search} />
                        <IoIosSearch className='absolute top-2 left-2 text-input' size={23} />
                    </span>
                </div>
                <div className="flex items-center justify-center gap-2 py-2">
                    <LuLayoutGrid className={`${view === 'grid' ? 'bg-black text-white' : 'bg-white text-black'} p-1.5 rounded-md cursor-pointer`} size={30} onClick={handleGridView} />
                    <FaListUl className={`${view === 'list' ? 'bg-black text-white' : 'bg-white text-black'} p-1.5 rounded cursor-pointer`} size={30} onClick={handleListView} />
                </div>
            </div>
            {view === 'list' ?
                (<div className='mt-6'>
                    <DataTable columns={Columns} data={filterData} selectableRows fixedHeader customStyles={customStyles} responsive />
                </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4">
                    {filterData.map((user, index) => (
                        <div key={index} className="border-t-8 border-red-500 flex flex-col justify-center items-center rounded-lg shadow pb-4 pt-8">
                            <img src="http://127.0.0.1:5000/public/users/1732604631781.jpg" alt={user.profilephoto} width={200} />
                            <div className='flex flex-col justify-center items-center mt-4'>
                                <h3 className="font-bold">{user.username}</h3>
                                <p className="text-gray-600">{user.role}</p>
                                <p className="text-gray-600">{user.company}</p>
                            </div>
                            <div className="flex justify-between mt-6 gap-4">
                                <button className="bg-yellow-500 text-white p-2 rounded-full"><FaBell /></button>
                                <button className="bg-yellow-500 text-white p-2 rounded-full"><LuDelete /></button>
                                <button className="bg-yellow-500 text-white p-2 rounded-full"><HiViewList /></button>
                                <button className="bg-yellow-500 text-white p-2 rounded-full"><GoDownload /></button>
                            </div>
                        </div>
                    ))}
                </div>)
            }
            {totalPages > 1 && (
                <div className="py-2 px-4 flex justify-between items-center mt-2 w-full">
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}
                        className="p-2 rounded w-24"
                    >
                        <option value="10">Show 10</option>
                        <option value="20">Show 20</option>
                        <option value="30">Show 30</option>
                    </select>
                    <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
                </div>
            )}
        </div>
    )
}

export default UserList;