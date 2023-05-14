/* eslint-disable */
// ** Table Columns

// ** Third Party Components
import { Check, ChevronDown, Info, Plus, Trash, XCircle } from 'react-feather'
import DataTable from 'react-data-table-component'
import { gql, useMutation, useQuery } from '@apollo/client'
// ** Reactstrap Imports
import { Button, Card, CardFooter, CardHeader, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Badge } from 'reactstrap'
import { Fragment, useState } from 'react'
import AddNewModal from './AddNewModal'
import { toast } from "react-toastify"
// import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setModalAlert, setSelectableRows, setSelectedRows } from './store'
import EditModal from './EditModal'
import  basicColumns  from './data'
import { useEffect } from 'react'
import Avatar from '@components/avatar'
import { GET_MATERIAL } from '.'
import Exportqs from '../extensions/import-export/Exportqs'
import moment from "moment"

const DELETE_MATERIAL = gql`
mutation deleteMRequirment($_in: [Int!]!) {
  delete_material_request(where: {id: {_in: $_in}}) {
    returning {
      id
    }
  }
}
`

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <div className="toastify-header pb-0">
    <div className="title-wrapper">
      <Avatar size="sm" color={color} icon={icon} />
      <h6 className="toast-title">{title}</h6>
    </div>
  </div>
)

const DataTablesBasic = ({setModal}) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.material)
  const material = store?.data?.material_request

  const [bgColor, setBgColor] = useState("#ffff")
  useEffect(() => {
    setBgColor("#f4ff54")
    setTimeout(() => {
      setBgColor("#ffff")
    }, 1000)
  }, [store.newData])
  
  const conditionalRowStyles = [
    {
      when: (row) => { if (store.newData.map(item => item.id).includes(row.id))  return true },
      style: {
        backgroundColor: bgColor,
        transition: "background-color 2s ease"
      }
    }
  ]

  const toggleModal = () => dispatch(setModalAlert(!store.modalAlert))

  //** GQL functions
  const [deleteMaterial, {loading: deleteMaterialLoading}] = useMutation(DELETE_MATERIAL, {
    refetchQueries: [{query: GET_MATERIAL}],
    onCompleted: (data) => {
    },
    onError: (e) => {
      console.log(e)
    }
  })

  //** Function to delete Bills
  const onDelete = async () => {
      try {
        let rowIds = store.selectedRows?.selectedRows.map(row => {
          return row.id
        })
        await deleteMaterial({
          variables: {
            _in: rowIds
          }
        })
        dispatch(setModalAlert(false))
        dispatch(setSelectedRows(false))
        dispatch(setSelectableRows(false))
        
        toast.success(
          <ToastComponent title="Material Deleted" color="success" icon={<Check />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
      } catch (error) {
        console.log(error)
        toast.error(
          <ToastComponent title="Error Deleting Material" color="danger" icon={<XCircle />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
      }
  }


      //for export data start
  //=================================
  const createExportObject = (DataTojson) => {
    const objectsToExport = []

    for (const keys in DataTojson) {
      console.log(DataTojson[keys])
      objectsToExport.push({
        id: DataTojson[keys]?.id,
        amount: DataTojson[keys]?.amount,
        created_at: moment(DataTojson[keys]?.created_at).format("YYYY-MM-DD hh:mm a"),
        inserted_by: DataTojson[keys]?.inserted_by,
        property: DataTojson[keys]?.property.address
      })
    }
      // console.log((objectsToExport))
    return (objectsToExport)

  }

  return (
      <Fragment>
        <Card className='overflow-hidden'>
          <CardHeader className='border-bottom'>
          <CardTitle tag="h4">View Material Requirements</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            {!store.selectableRows && <Button className='ml-2' color='primary' onClick={() => {
              dispatch(setSelectedRows(false))
              setModal(true)
              }}>
              <Plus size={15} />
              <span className='align-middle ml-50'>Add Record</span>
            </Button>}
            </div>
          </CardHeader>
          {/* <Exportqs InData={createExportObject(material)}></Exportqs> */}
          <div className='react-dataTable'>
            <DataTable
              noHeader
              pagination
              data={material}
              columns={basicColumns()}
              className='react-dataTable'
              selectableRows={store.selectableRows}
              selectableRowsHighlight
              clearSelectedRows={!store.selectableRows}
              conditionalRowStyles={conditionalRowStyles}
              onSelectedRowsChange={(row) => dispatch(setSelectedRows(row))}
              sortIcon={<ChevronDown size={10} />}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              />
          </div>

          <CardFooter>
            {/* Selectable Row Button toggle */}
            {material?.length > 0 && <Button size="sm" color='secondary' onClick={() => {
              dispatch(setSelectableRows(!store.selectableRows))
              dispatch(setSelectedRows(false))
              }}>
              <Info size={15} />
              <span className='align-middle ml-50'>Toggle Selectable Rows</span>
            </Button>}
            {/* Delet button */}
            {store.selectedRows?.selectedCount > 0 && 
            <Button size="sm ml-2" color='danger' onClick={() => dispatch(setModalAlert(true))}>
              <Trash size={15} />
              <span className='align-middle ml-50'>Delete</span>
            </Button>
          }
          </CardFooter>
        </Card>

      <EditModal />

      {/* Alert Modal */}
      <div className='theme-modal-danger'>
        <Modal
          isOpen={store.modalAlert}
          toggle={toggleModal}
          className='modal-dialog-centered'
          modalClassName="modal-danger"
        >
          <ModalHeader toggle={toggleModal}>Delete Record</ModalHeader>
          <ModalBody>
            {deleteMaterialLoading ? <div style={{display: "flex", justifyContent: "center"}}><Spinner /></div> : "Are you sure you want to delete?"}
          </ModalBody>
          {(!deleteMaterialLoading || material.length) > 0 && 
          <ModalFooter>
            <Button color="danger" onClick={() => onDelete() } >
              Delete
            </Button>
            <Button color='secondary' onClick={toggleModal} outline>
              Cancel
            </Button>
          </ModalFooter>}
        </Modal>
      </div>
    </Fragment>

  )
}

export default DataTablesBasic
