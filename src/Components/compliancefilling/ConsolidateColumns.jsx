import ActionMenu from "./ConsolidateAction"
import { MdOutlineLocationOn } from "react-icons/md";
import img from "../../Images/sky.jpg"
import Dummy2 from "./ScoreDummy";
const columns = [
    {
        name: 'S NO',
        selector: (row,index) => index+1,
        sortable: true,
        width: '80px'
    },
    {
        name: 'Company',
        cell: (row) => <span className="flex justify-center items-center gap-3"> <img src={img} alt="Picture" className="w-9 h-9  rounded-full" /> {row.companyname}</span>,
        sortable: true,
        width:'220px',
        center:true
    },
    {
        name: 'State',
        cell: (row) => <span className="flex justify-center items-center gap-0.5"><MdOutlineLocationOn size={22} /> {row.statename}</span>,
        sortable: true,
        center:true,
        width:'160px'
    },
    {
        name: 'Branch',
        cell: (row) => <span className="flex justify-center items-center gap-0.5"> <MdOutlineLocationOn size={22} /> {row.branch}</span>,
        sortable: true,
        width:'130px',
        center:true
    },
    {
        name: 'Compliance',
        selector: row => row.activity,
        sortable: true,
        width:'130px',
        center:true
    },
    {
        name: 'Assign staff',
        selector: row => row.staff_name,
        sortable: true,
        width:'110px',
    },
    {
        name: 'Priority',
        selector: row => row.priority,
        sortable: true,
        width:'90px',     
    },
    {
        name: 'Score',
        cell: (row) => (<Dummy2 percent={row.score} />),
        selector: row => row.score,
        width:'90px',
        center:true
    },
    // {
    //     name: 'Status',
    //     cell: (row) => <span className={`${row.status === 'Complied' ? 'bg-green-400'
    //         : `${row.status === 'Not Complied' ? 'bg-red-400'
    //             : `${row.status === 'Partially Complied' ? 'bg-yellow-400'
    //                 : `${row.status === 'Over Due' ? 'bg-orange-400' : ''}`}`}`
    //         } rounded-full  items-center w-44 text-center py-1 px-2 text-sm text-nowrap`}>{row.status}</span>,
    //     sortable: true,
    //     width:'160px',
    //     center:true
    // },
    {
        name: 'Status',
cell: () => (
    <span className="bg-red-400 rounded-full items-center w-44 text-center py-1 px-2 text-sm text-nowrap">
        Not Complied
    </span>
),
sortable: true,
width: '160px',
center: true,

    },
    {
        name: 'Action',
        selector: row => row.action,
        cell: (row) => <ActionMenu row={row} />,
        right: true,
        width: '100px',
        center:true
    },
]
export default columns














