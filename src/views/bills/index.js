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

export const GET_BILLS = gql`
query getBills {
  bills(order_by: {id: desc}) {
    id
    image_ids
    amount
    created_at
    inserted_by
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
  const store = useSelector(state => state.bills)
  const bills = store?.data?.bills

  // const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const [getBills, {loading}] = useLazyQuery(GET_BILLS, {
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
      console.log(data)
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
    getBills()
  }, [])
  
    //for export data start
  //=================================
  return (
    <Fragment>
    <Card>

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
