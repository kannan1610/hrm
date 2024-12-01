import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { HiOutlinePencil } from "react-icons/hi";

const ActionMenu = ({ handleDelete, handleEdit, handleView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const optionClick = (action) => {
    setIsOpen(false);  // Close the menu after an option is clicked
    if (action === "Delete") {
      handleDelete(); 
       // Call delete function passed as a prop
    } else if (action === "Edit") {
      handleEdit();    // Call edit function passed as a prop
    } else if (action === "View") {
      handleView();    // Call view function passed as a prop
    }
  };
  
  return (
    <div className="relative p-2 cursor-pointer" onClick={toggleMenu}>
      <HiDotsVertical size={15} />
      {isOpen && (
        <div className="absolute -left-24 -top-3 bg-light border border-bordergray shadow-md rounded-md w-24 p-2 z-50">
          <span className="flex justify-start items-center gap-2" onClick={() => optionClick("Edit")}>
            <HiOutlinePencil size={15} /> Edit
          </span>
          <span className="flex justify-start items-center gap-2" onClick={() => optionClick("Delete")}>
            <RiDeleteBinLine size={15} /> Delete
          </span>
          <span className="flex justify-start items-center gap-2" onClick={() => optionClick("View")}>
            <FiEye size={15} /> View
          </span>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
