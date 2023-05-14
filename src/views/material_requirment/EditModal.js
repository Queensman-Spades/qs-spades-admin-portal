/* eslint-disable */
// ** React Imports
import { useState } from 'react'

import { gql, useMutation, useQuery } from '@apollo/client'

// ** Third Party Components
import { toast } from "react-toastify"
import Avatar from '@components/avatar'
import { User, X, Check, XCircle } from 'react-feather'
import { useForm } from 'react-hook-form'

// ** Reactstrap Imports
import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Form, FormFeedback, Badge } from 'reactstrap'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setEditModal, newRows, resetDefault } from './store'
import { GET_MATERIAL  } from '.'
import { useEffect } from 'react'

const UPDATE_MATERIAL = gql`
mutation MyMutation(
  $id: Int!
  $updated_by: String!
  $m_from_order_aed: Int!
  $m_from_order_count: Int!
  $m_from_shop_visit_aed: Int!
  $m_from_shop_visit_count: Int!
  $m_used_from_van_aed: Int!
  $m_used_from_van_count: Int!
  $total_price: Int!
) {
  update_material_request(
    where: {id: {_eq: $id}}, _set: {
      updated_by: $updated_by
      m_from_order_aed: $m_from_order_aed
      m_from_order_count: $m_from_order_count
      m_from_shop_visit_aed: $m_from_shop_visit_aed
      m_from_shop_visit_count: $m_from_shop_visit_count
      m_used_from_van_aed: $m_used_from_van_aed
      m_used_from_van_count: $m_used_from_van_count
      total_price: $total_price
    }
  ) {
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

const EditModal = () => {
  const userData = "admin@queensman.com"
    const dispatch = useDispatch()
    const store = useSelector(state => state.material)
    const selectedRow = store?.selectedRows
    const modalEdit = store?.modalEdit
  // ** State
    const [m_from_shop_visit_count, setm_from_shop_visit_count] = useState(selectedRow?.m_from_shop_visit_count)
    const [m_from_order_count, setm_from_order_count] = useState(selectedRow?.m_from_order_count)
    const [m_used_from_van_count, setm_used_from_van_count] = useState(selectedRow?.m_used_from_van_count)
    const [m_from_shop_visit_aed, setm_from_shop_visit_aed] = useState(selectedRow?.m_from_shop_visit_aed)
    const [m_used_from_van_aed, setm_used_from_van_aed] = useState(selectedRow?.m_used_from_van_aed)
    const [m_from_order_aed, setm_from_order_aed] = useState(selectedRow?.m_from_order_aed)
    const [total_price, settotal_price] = useState(selectedRow?.total_price)

  const handleModal = () => {
    dispatch(setEditModal(!modalEdit))
  }

  // ** Custom close btn
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  const [updateMaterial] = useMutation(UPDATE_MATERIAL, {
    refetchQueries: [{query: GET_MATERIAL }],
    onCompleted: (data) => {
        dispatch(newRows(data.update_material_request.returning))
        setTimeout(() => {
          dispatch(resetDefault([]))
        }, 2000);
    }
  })


  const { reset, register, errors, handleSubmit, clearErrors } = useForm()
  
  const onDiscard = () => {
    clearErrors()
    dispatch(setEditModal(false))
    reset()
  }

  const onSubmit = async _ => {
    const myData = {
      m_from_shop_visit_count: m_from_shop_visit_count,
      m_from_order_count: m_from_order_count,
      m_used_from_van_count: m_used_from_van_count,
      m_from_shop_visit_aed: m_from_shop_visit_aed,
      m_used_from_van_aed: m_used_from_van_aed,
      m_from_order_aed: m_from_order_aed,
      total_price: total_price,
    }
      if (Object.values(myData).every(field => field.toString().length > 0)) {
        const {
          m_from_shop_visit_count,
          m_from_order_count,
          m_used_from_van_count,
          m_from_shop_visit_aed,
          m_used_from_van_aed,
          m_from_order_aed,
          total_price
        } = myData
      try {
        await updateMaterial({
          variables: {
            id: selectedRow.id,
            m_from_shop_visit_count,
            m_from_order_count,
            m_used_from_van_count,
            m_from_shop_visit_aed,
            m_used_from_van_aed,
            m_from_order_aed,
            total_price,
            updated_by: userData,
          }
        })
        dispatch(setEditModal(false))
        reset()
        toast.success(
          <ToastComponent title="Material Updated" color="success" icon={<Check />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
      } catch (error) {
        console.log(error)
        toast.error(
          <ToastComponent title="Error Updating Material" color="danger" icon={<XCircle />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false
          }
        )
      }
  }
}
  useEffect(() => {
    setm_from_shop_visit_count(selectedRow?.m_from_shop_visit_count)
    setm_from_order_count(selectedRow?.m_from_order_count)
    setm_used_from_van_count(selectedRow?.m_used_from_van_count)
    setm_from_shop_visit_aed(selectedRow?.m_from_shop_visit_aed)
    setm_used_from_van_aed(selectedRow?.m_used_from_van_aed)
    setm_from_order_aed(selectedRow?.m_from_order_aed)
    settotal_price(selectedRow?.total_price)
  }, [modalEdit])
  

  return (
    <Modal
      isOpen={modalEdit}
      onClosed={onDiscard}
      toggle={handleModal}
      className='modal-dialog-centered modal-xl'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>Edit Record</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
      <Form onSubmit={handleSubmit(onSubmit)}>

      <div className='mb-1'>
          <Label className='form-label' for='m_from_shop_visit_count'>
          Materials from the direct shop visit(count)
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input placeholder='Materials from the direct shop visit(count)' value={m_from_shop_visit_count} onChange={(e) => setm_from_shop_visit_count(e.target.value)} invalid={errors.m_from_shop_visit_count && true}  />
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
            <Input placeholder='Materials from the order(count)' value={m_from_order_count} onChange={(e) => setm_from_order_count(e.target.value)} invalid={errors.m_from_order_count && true}  />
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
            <Input placeholder='Materials used from the Van(count)' value={m_used_from_van_count} onChange= {(e) => setm_used_from_van_count(e.target.value)} invalid={errors.m_used_from_van_count && true}  />
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
            <Input placeholder='Materials from the direct shop visit(AED)' value={m_from_shop_visit_aed} onChange= {(e) => setm_from_shop_visit_aed(e.target.value)} invalid={errors.m_from_shop_visit_aed && true}  />
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
            <Input placeholder='Materials used from the Van(AED)' value={m_used_from_van_aed} onChange={(e) => setm_used_from_van_aed(e.target.value)} invalid={errors.m_used_from_van_aed && true}  />
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
            <Input placeholder='Materials from the order(AED)' value={m_from_order_aed} onChange={(e) => setm_from_order_aed(e.target.value)} invalid={errors.m_from_order_aed && true}  />
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
            <Input placeholder='Total Price' value={total_price} onChange={(e) => settotal_price(e.target.value)} invalid={errors.total_price && true}  />
          </InputGroup>
        </div>

        <Button className='mr-1' color='primary' type='submit'>
          Save Changes
        </Button>
        <Button color='secondary' onClick={onDiscard} outline>
          Cancel
        </Button>
      </Form>
      </ModalBody>
    </Modal>
  )
}

export default EditModal
