/*eslint-disable*/
// ** React Imports
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'
import { User, Briefcase, Mail, Calendar, X, Check, XCircle } from 'react-feather'
import * as yup from 'yup'
import { toast } from "react-toastify"
import Avatar from '@components/avatar'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Form, FormFeedback, Badge, Spinner} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { GET_MATERIAL } from '.'
import { newRows, resetDefault, setFiles } from './store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import { storage } from '../../utility/nhost'
import { useNiceLazyQuery, useNiceMutation, useNiceQuery } from '../../utility/Utils'
import { HASURA } from '../../_config'

const ADD_NEW_MATERIAL = gql`
mutation MyMutation(
  $inserted_by: String!
  $m_from_order_aed: Int!
  $m_from_order_count: Int!
  $m_from_shop_visit_aed: Int!
  $m_from_shop_visit_count: Int!
  $m_used_from_van_aed: Int!
  $m_used_from_van_count: Int!
  $property_id: Int!
  $total_price: Int!
) {
  insert_material_request_one(
    object: {
      inserted_by: $inserted_by
      m_from_order_aed: $m_from_order_aed
      m_from_order_count: $m_from_order_count
      m_from_shop_visit_aed: $m_from_shop_visit_aed
      m_from_shop_visit_count: $m_from_shop_visit_count
      m_used_from_van_aed: $m_used_from_van_aed
      m_used_from_van_count: $m_used_from_van_count
      property_id: $property_id
      total_price: $total_price
    }
  ) {
    id
  }
}
`

const GET_PROPERTY = gql`
query getProperty($client_id: Int!) {
  property_owned(where: {owner_id: {_eq: $client_id}}) {
    id
    property {
      id
      address
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

const AddNewModal = ({ open, handleModal, setModal }) => {

  const dispatch = useDispatch()
  // ** State
  const userData = "admin@queensman.com"

  const store = useSelector(state => state.material)

  const [clientId, setClientId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [m_from_shop_visit_count, setm_from_shop_visit_count] = useState(null)
  const [m_from_order_count, setm_from_order_count] = useState(null)
  const [m_used_from_van_count, setm_used_from_van_count] = useState(null)
  const [m_from_shop_visit_aed, setm_from_shop_visit_aed] = useState(null)
  const [m_used_from_van_aed, setm_used_from_van_aed] = useState(null)
  const [m_from_order_aed, setm_from_order_aed] = useState(null)
  const [total_price, settotal_price] = useState(null)
  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  const [addMaterial, {loading}] = useMutation(ADD_NEW_MATERIAL, {
    refetchQueries: [{query: GET_MATERIAL}],
    onCompleted: (data) => {
      dispatch(newRows([{id: data.insert_material_request_one.id}]))
      setTimeout(() => {
        dispatch(resetDefault([]))
      }, 2000)
  }
  })

  const [getProperty, {data: propertyData}] = useLazyQuery(GET_PROPERTY, {
    onCompleted: (data) => {
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const getClientOptions = (client) => {
    if (client) {
      return  client?.map(client => {
      return {...client, label: client?.full_name, value: client?.id}
    })
  }
  }

  const formatClientOptions = ({ label, email }) => {
    return (
      <li style={{listStyle: "none"}}>
        <span style={{marginRight: "10px"}}>{label}</span>
        <Badge color='light-secondary'>
          {email}
        </Badge>
    </li>
  )
}

  const getPropertyOptions = (property_owned) => {
    if (property_owned) {
      return  property_owned?.map(property_owned => {
      return {...property_owned, label: property_owned.property?.address, value: property_owned.property?.id}
    })
  }
  }

  const formatPropertyOptions = ({ label, value }) => {
    return (
      <li style={{listStyle: "none"}}>
        <span style={{marginRight: "10px"}}>{label}</span>
        <Badge color='light-secondary'>
          {value}
        </Badge>
    </li>
  )
}

  const colourStyles = {
    multiValue: (styles) => {
      const color = "#162f57"
      return {
        ...styles,
        backgroundColor: color
      }
    }
  }

  const { reset, register, errors, handleSubmit } = useForm()
  
  const onDiscard = () => {
    setModal(false)
    reset()
  }

  const onSubmit = async _ => {
    try {
      const myData = {
        property_id: selectedProject,
        m_from_shop_visit_count: m_from_shop_visit_count,
        m_from_order_count: m_from_order_count,
        m_used_from_van_count: m_used_from_van_count,
        m_from_shop_visit_aed: m_from_shop_visit_aed,
        m_used_from_van_aed: m_used_from_van_aed,
        m_from_order_aed: m_from_order_aed,
        total_price: total_price,
      }
      if (Object.values(myData).every(field => field.toString().length > 0)) {
        const {property_id, 
          m_from_shop_visit_count,
          m_from_order_count,
          m_used_from_van_count,
          m_from_shop_visit_aed,
          m_used_from_van_aed,
          m_from_order_aed,
          total_price
        } = myData
        try {
          setSubmitLoading(true)
  
          await addMaterial({
            variables: {
              property_id,
              m_from_shop_visit_count,
              m_from_order_count,
              m_used_from_van_count,
              m_from_shop_visit_aed,
              m_used_from_van_aed,
              m_from_order_aed,
              total_price,
              inserted_by: userData,
            }
          })
          setSubmitLoading(false)
          setModal(false)
          reset()
          dispatch(setFiles([]))
          toast.success(
            <ToastComponent title="Material Created" color="success" icon={<Check />} />,
            {
              autoClose: 2000,
              hideProgressBar: true,
              closeButton: false
            }
          )
        } catch (error) {
          console.log(error)
          setSubmitLoading(false)
          toast.error(
            <ToastComponent title="Error Creating New Material" color="danger" icon={<XCircle />} />,
            {
              autoClose: 2000,
              hideProgressBar: true,
              closeButton: false
            }
          )
        }
      }
    } catch(e) {
    console.log(e)
    }
  }

  useEffect(() => {
    if(clientId) {
      getProperty({
        variables: {
          client_id: clientId
        }
      })
    }
  }, [clientId])
  

  return (
    <>
    <Modal
      isOpen={open}
      onClosed={onDiscard}
      toggle={handleModal}
      className='modal-dialog-centered modal-xl'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Add Bill or Receipt</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <Form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-1'>
        <Label className='form-label' for='client'>Select Client</Label>
          <Select
          classNamePrefix='select'
          options={getClientOptions(store.projectOptions)}
          formatOptionLabel={formatClientOptions}
          onChange={(e) => setClientId(e.id)}
          isClearable={false}
          styles={colourStyles}
          className={'react-select'}
        />        
      </div>

      <div className='mb-1'>
        <Label className='form-label' for='property'>Select Property</Label>
          <Select
          classNamePrefix='select'
          options={getPropertyOptions(propertyData?.property_owned)}
          formatOptionLabel={formatPropertyOptions}
          isClearable={false}
          styles={colourStyles}
          onChange={(e) => setSelectedProject(e.property.id)}
          className={'react-select'}
        />
      </div>

        <div className='mb-1'>
          <Label className='form-label' for='m_from_shop_visit_count'>
          Materials from the direct shop visit(count)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials from the direct shop visit(count)' onChange={(e) => setm_from_shop_visit_count(e.target.value)} invalid={errors.m_from_shop_visit_count && true}  />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='m_from_order_count'>
          Materials from the order(count)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials from the order(count)' onChange={(e) => setm_from_order_count(e.target.value)} invalid={errors.m_from_order_count && true}  />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='m_used_from_van_count'>
          Materials used from the Van(count)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials used from the Van(count)' onChange={(e) => setm_used_from_van_count(e.target.value)} invalid={errors.m_used_from_van_count && true}  />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='m_from_shop_visit_aed'>
          Materials from the direct shop visit(AED)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials from the direct shop visit(AED)' onChange={(e) => setm_from_shop_visit_aed(e.target.value)} invalid={errors.m_from_shop_visit_aed && true}  />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='m_used_from_van_aed'>
          Materials used from the Van(AED)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials used from the Van(AED)' onChange={(e) => setm_used_from_van_aed(e.target.value)} invalid={errors.m_used_from_van_aed && true}  />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='m_from_order_aed'>
          Materials from the order(AED)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials from the order(AED)' onChange={(e) => setm_from_order_aed(e.target.value)} invalid={errors.m_from_order_aed && true}  />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='total_price'>
          Total Price
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Total Price' onChange={(e) => settotal_price(e.target.value)} invalid={errors.total_price && true}  />
          </InputGroup>
        </div>

        <Button className='me-1' color='primary' type='submit'>
          Submit
        </Button>
        <Button color='secondary' onClick={onDiscard} outline>
          Cancel
        </Button>
      </Form>
      </ModalBody>
      {/* /** Loading Modal  */ }
      <Modal isOpen={submitLoading || loading} className='modal-dialog-centered'>
        <ModalBody>
        <div className='d-flex align-items-center justify-content-center'>
          <Spinner color="primary" /><div className='ms-2'>Loading</div>
        </div>
        </ModalBody>
        </Modal>

    </Modal>

    </>
  )
}

export default AddNewModal
