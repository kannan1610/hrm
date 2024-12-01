import ActionMenu from "./ActionMenu";

const NatureColumns = [
    {
        name: 'S NO',
        selector: (row, index) => index + 1,
        sortable: true,
        grow:1
    },
    {
        name: 'Nature of Compliance',
        selector: row => row.nature,
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

export default NatureColumns