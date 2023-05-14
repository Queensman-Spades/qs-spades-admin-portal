/*eslint-disable*/
// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import { gql, useLazyQuery } from '@apollo/client'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

import {
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Label
} from "reactstrap"
// ** Demo Components
import TableZeroConfig from './TableZeroConfig'

import moment from "moment"
// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss"
import "@styles/react/libs/flatpickr/flatpickr.scss"

import { useDispatch, useSelector } from 'react-redux'
import { Calendar, RefreshCw } from "react-feather"
import Exportqs from '../extensions/import-export/Exportqs'
// ** Custom Components
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import { setData, setProject, setProjectOptions } from "./store"

import { useNiceMutation, useNiceQuery, useNiceLazyQuery } from "../../utility/Utils"
import AddNewModal from './AddNewModal'


export const GET_MATERIAL = gql`
query GetMaterialRequest {
  material_request(order_by: {id: desc}) {
    id
    created_at
    inserted_by
    m_from_shop_visit_count
    m_from_order_count
    m_used_from_van_count
    m_from_shop_visit_aed
    m_used_from_van_aed
    m_from_order_aed
    total_price
    property {
      id
      address
    }
  }
}
`

const GET_CLIENTS = gql`
  query GetClient {
    client(order_by: { id: desc }) {
      id
      email
      full_name
    }
  }
`

const Tables = () => {
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const handleModal = () => setModal(!modal)
  const [picker, setPicker] = useState([
    moment().subtract(7, "days").endOf('day').toDate(),
    moment().endOf('day').toDate()
  ]) //last 7 days defualt
  const store = useSelector(state => state.material)
  const material = store?.data?.material

  // const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const [getMaterials, {loading}] = useLazyQuery(GET_MATERIAL, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      dispatch(setData(data))
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const [getClients, { loading: projectLoading }] = useLazyQuery(GET_CLIENTS, {
    onCompleted: (data) => {
      dispatch(
        setProjectOptions(
          data.client.map((client) => {
            return { ...client, label: client?.full_name, value: client?.id }
          })
        )
      )
    },
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    getClients()
    getMaterials()
  }, [])
  
    //for export data start
  //=================================
  const createExportObject = (DataTojson) => {
    const objectsToExport = []

    for (const keys in DataTojson) {
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
    {/* <div className='d-flex mb-2 align-items-center justify-content-between'>
        <div>
      <h1 className='fw-bolderer flex-1'>material</h1>
      </div>
      <div className='mr-2'>
      <Button size="sm" className='mr-2' onClick={() => getMaterials()}>
        <RefreshCw size={15} />
        <span className='align-middle ml-50'>Refresh</span>
    </Button>
    </div>
    </div> */}
    <Card>
        {/* <CardHeader>
          <CardTitle tag="h4">View and add material</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <Exportqs InData={createExportObject(material)}></Exportqs>
          </div>
        </CardHeader> */}

        {
          loading ? (
            <Card>
              <CardBody>
                <div className="d-flex align-items-center justify-content-center">
                  <Spinner color="primary" />
                  <div className="ms-2">Loading</div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <TableZeroConfig setModal={setModal}/>
          )
        }
      </Card>
      <AddNewModal open={modal} handleModal={handleModal} setModal={setModal}  />

    </Fragment>
  )
}

export default Tables
