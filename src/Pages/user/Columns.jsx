import Actions from "./Actions";
import ActionMenu from "../../Components/category/ActionMenu"; // Import ActionMenu
import CompanyIcon from "./CompanyIcon";
import UserIcon from "./UserIcon";

export const Columns = [
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