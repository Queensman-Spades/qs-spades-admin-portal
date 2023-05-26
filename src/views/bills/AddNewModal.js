/*eslint-disable*/
// ** React Imports
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'

// ** Third Party Components
import { User, X, Check, XCircle } from 'react-feather'
import { toast } from "react-toastify"
import { useForm } from 'react-hook-form'
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Form, FormFeedback, Badge, Spinner} from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { GET_BILLS } from '.'
import { newRows, resetDefault, setFiles } from './store'
import { useDispatch, useSelector } from 'react-redux'
import FileUploaderSingle from './FileUploaderSingle'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { nhost } from '../../App'
import { useUserDisplayName } from '@nhost/react'

const ADD_NEW_BILL = gql`
mutation MyMutation($property_id: Int!, $amount: String!, $inserted_by: String!, $image_ids: _text) {
  insert_bills_one(object: {property_id: $property_id, amount: $amount, inserted_by: $inserted_by, image_ids: $image_ids}) {
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
  const displayName = useUserDisplayName()
  const store = useSelector(state => state.bills)

  const [clientId, setClientId] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [amount, setAmount] = useState(null)
  console.log(clientId)
  console.log(selectedProject)
  console.log(amount)
  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  const [addBill, {loading}] = useMutation(ADD_NEW_BILL, {
    refetchQueries: [{query: GET_BILLS}],
    onCompleted: (data) => {
      dispatch(newRows([{id: data.insert_bills_one.id}]))
      setTimeout(() => {
        dispatch(resetDefault([]))
      }, 2000)
  }
  })

  const [getProperty, {data: propertyData}] = useLazyQuery(GET_PROPERTY, {
    onCompleted: (data) => {
      console.log(data)
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
        amount: amount,
        property_id: selectedProject,
      }
      if (Object.values(myData).every(field => field.toString().length > 0)) {
        const {property_id, amount} = myData
        console.log(store.files)
        try {
          setSubmitLoading(true)
  
          const mapLoop = async () => {
            const promises = store.files.map(async item => {
              const res = await nhost.storage.upload({
                file: item,
                bucketId: "bills"
              })
              const url = await nhost.storage.getPublicUrl({
                fileId: res.fileMetadata.id
              })
              return url
            })
          
            return await Promise.all(promises)
          }
  
          const toArrayLiteral = (arr) => (JSON.stringify(arr).replace('[', '{').replace(']', '}'))
          let image_ids = await mapLoop()
          image_ids = toArrayLiteral(image_ids)
          console.log({image_ids})
          await addBill({
            variables: {
              amount,
              property_id,
              inserted_by: displayName,
              image_ids: image_ids == '{}' ? null : image_ids
            }
          })
          setSubmitLoading(false)
          setModal(false)
          reset()
          dispatch(setFiles([]))
          toast.success(
            <ToastComponent title="Item Created" color="success" icon={<Check />} />,
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
            <ToastComponent title="Error Creating New Bill" color="danger" icon={<XCircle />} />,
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

  console.log(errors)
  useEffect(() => {
    if(clientId) {
      console.log("run get prop")
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
          <Label className='form-label' for='amount'>
          Amount
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Amount' onChange={(e) => setAmount(e.target.value)} invalid={errors.amount && true}  />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <FileUploaderSingle />
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
