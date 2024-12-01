import { useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiOutlinePencil } from "react-icons/hi";
const NatureAction = () => {
    const [isOpen, setIsOpen] = useState(false);
    

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const optionClick = (action) => {
        setIsOpen(false);  // Close the menu after an option is clicked
        if (action === "Delete") {
          handleDelete();  // Call delete function passed as a prop
        } else if (action === "Edit") {
          handleEdit();    // Call edit function passed as a prop
        } else if (action === "View") {
          handleView();    // Call view function passed as a prop
        }
      };


    return (
        <div className="relative  -me-3  flex" >
            <button className="three-dot-icon" onClick={toggleMenu} aria-label="More options">
            <HiDotsVertical className="m-2" />
            </button>   

            {isOpen && (
                <div className=" absolute right-20 top-36  flex font-medium px-1 bg-red-400  ">
                    <div className=" px-1 w-20 bg-gray-300 rounded-lg  " >
                        <div className="flex gap-2 py-1 hover:bg-gray-200" onClick={()=>optionClick("Edit")} >
                        <HiOutlinePencil size={15}/>  <button>Edit</button>
                        </div>
                        <div className="flex gap-2 py-1 hover:bg-gray-200" onClick={()=>optionClick("Delete")}>
                            <RiDeleteBinLine size={15} /><button>Delete</button> 
                        </div>
                        <div className="flex gap-2 py-1 hover:bg-gray-200" onClick={()=>optionClick('View')}>
                        <FiEye size={15} /> <button>View</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NatureAction;