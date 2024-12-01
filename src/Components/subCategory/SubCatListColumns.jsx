import ActionMenu from "../category/ActionMenu";
import { HiDotsVertical } from "react-icons/hi";
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
      name:'Actions',
      cell:(row)=><button> <HiDotsVertical/></button>,
      cell:(row)=> <ActionMenu
      handleDelete={() => handleDelete(row.id)}
      handleEdit={() => handleEdit(row.id)}
      handleView={() => handleView(row.id)}
    />,
      ignoreClick:true,
      selector: row=>row.actions,
      right:true,
    },
  ];
  export default columns;