import React, { useState, useEffect } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import DataTable from "react-data-table-component";
import { PiCaretUpDownFill } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ActionMenu from "../../Components/category/ActionMenu"; // Import ActionMenu
import { get, remove } from "../../api";

const CategoryList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get("/category");
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search term
  useEffect(() => {
    const filtered = data.filter((row) =>
      row.category_name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  // Delete handler
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
        await remove(`/category/${id}`); // Call the API
        setData((prevData) => prevData.filter((item) => item.id !== id)); // Update state
        console.log("Successfully deleted ID:", id); // Debug log
        Swal.fire("Deleted!", "The category has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire("Error!", "Failed to delete the category.", "error");
      }
    }
  };
  

  // Edit handler
  const handleEdit = (id) => {
    navigate(`/updatecategory/${id}`); // Redirect to edit page
  };

  // View handler
  const handleView = (id) => {
    navigate(`/categorylist`); // Redirect to view page
  };

  // Custom table styles
  const customStyles = {
    rows: { style: { minHeight: "55px" } },
    headCells: {
      style: { backgroundColor: "#000", color: "#fff", fontSize: "14px" },
    },
    cells: { style: { fontSize: "14px" } },
  };

  // Download CSV
  const downloadCSV = () => {
    const csv = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "CategoryList.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns with ActionMenu
  const columns = [
    {
      name: "Sl No",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    { name: "Category Name", selector: (row) => row.category_name, sortable: true },
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

  return (
    <>
      <div className="flex flex-col gap-2 items-start lg:flex-row m-5 lg:items-center lg:justify-between">
        <h2 className="font-semibold text-lg">Category List</h2>
        <div className="flex gap-3 items-center">
          <HiOutlineDownload
            onClick={downloadCSV}
            className="w-9 h-9 p-2 rounded-full bg-primary text-light"
          />
          <Link to="/category">
            <button className="py-2 w-36 rounded-md text-white bg-primary">
              Create Category
            </button>
          </Link>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          className="m-5 focus:outline-none mt-2 bg-gray-100 border text-md text-black border-bordergray px-7 py-2 rounded-md"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 top-4 left-6">
          <IoIosSearch size={25} className="text-slate-400" />
        </div>
      </div>
      <div className="mx-4 mr-7">
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={customStyles}
          selectableRows
          sortIcon={<PiCaretUpDownFill style={{ color: "white" }} />}
        />
      </div>
    </>
  );
};

export default CategoryList;
