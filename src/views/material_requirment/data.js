/*eslint-disable*/
import { Edit } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedRows, setEditModal } from "./store"
import moment from 'moment'
import { saveAs } from 'file-saver';
// import zip from 'jszip'
import { Download } from 'react-feather'
import { Button } from "reactstrap";
// import { nhost } from '../../App';

// ** Table Zero Config Column
const basicColumns = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.material)
  const basicColumns = [
    {
      name: 'ID',
      sortable: true,
      minWidth: "10px",
      wrap: true,
      selector: row => row?.id
    },
    {
      name: 'Materials from the direct shop visit(count)',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.m_from_shop_visit_count
    },
    {
      name: 'Materials from the order(count)',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.m_from_order_count
    },
    {
      name: 'Materials used from the Van(count)',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.m_used_from_van_count
    },
    {
      name: 'Materials from the direct shop visit(AED)',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.m_from_shop_visit_aed
    },
    {
      name: 'Materials used from the Van(AED)',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.m_used_from_van_aed
    },
    {
      name: 'Materials from the order(AED)',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.m_from_order_aed
    },
    {
      name: 'Total Price',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.  total_price
    },
    {
      name: 'Added By',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.inserted_by
    },
    {
      name: 'Property Address',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.property.address
    },
    {
      name: 'Created At',
      sortable: true,
      minWidth: "200px",
      wrap: true,
      selector: row => row?.created_at,
      cell: (row) => (
        moment(row.created_at).format("YYYY-DD-MM h:mm a")
      )
    },
    {
      name: "Actions",
      minWidth: "200px",
      allowOverflow: true,
      omit: store.selectableRows,
      cell: (row) => {
          return (
            <Button color="warning" className="btn-icon" size="sm" onClick={() => {
              dispatch(setEditModal(true))
              dispatch(setSelectedRows(row))
            }}>
              <Edit size={15} />
            </Button>
            )
      }
    }
  ]
  return basicColumns
}

export default basicColumns
