import ActionMenu from './ActionMenu';
import { HiDotsVertical } from 'react-icons/hi';

const columns = [
  {
    name: 'S NO',
    selector: (row, index) => index + 1,
    sortable: false,
    grow:1,
  },
  {
    name: 'Category',
    selector: row => row.category_name,
    sortable: true,
  },
  {
      name: "Actions",
      right: true,
      cell: (row) => (
        <ActionMenu
          handleDelete={() => handleDelete(row.id)}
          handleEdit={() => handleEdit(row.id)}
          handleView={() => handleView(row.id)}
        />
      ),
    },
];

export default columns;
