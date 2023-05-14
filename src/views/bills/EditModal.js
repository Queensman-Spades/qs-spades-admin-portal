// /* eslint-disable */
// // ** React Imports
// import { useState } from 'react'

// import { gql, useMutation, useQuery } from '@apollo/client'

// // ** Third Party Components
// import classnames from 'classnames'
// import Flatpickr from 'react-flatpickr'
// import { User, Briefcase, Mail, Calendar, X } from 'react-feather'
// import * as yup from 'yup'
// import toast from 'react-hot-toast'
// import { Controller, useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'

// // ** Reactstrap Imports
// import { Modal, Input, Label, Button, ModalHeader, ModalBody, InputGroup, InputGroupText, Form, FormFeedback, Badge } from 'reactstrap'

// // ** Styles
// import '@styles/react/libs/flatpickr/flatpickr.scss'
// import { useUserData } from '@nhost/react'
// import { useDispatch, useSelector } from 'react-redux'
// import { setEditModal, newRows, resetDefault } from './store'
// import { GET_MILSTONE } from '.'
// import { useEffect } from 'react'
// import Select from 'react-select'

// const UPDATE_MILESTONE = gql`
// mutation updateMilestone($id: Int!, $client_id: Int!, $description: String, $due_date: date!, $updated_by: String!) {
//   update_milestones(where: {id: {_eq: $id}}, _set: {project_id: $client_id, milestone: $description, due_date: $due_date, updated_by: $updated_by}) {
//     returning {
//       id
//     }
//   }
// }

// `

// const GET_PROJECTS = gql`
// query GetProjects {
//   projects {
//     id
//     client_name
//     client_email
//   }
// }`

// const EditModal = () => {

//     const dispatch = useDispatch()
//     const store = useSelector(state => state.milestone)
//     const selectedRow = store?.selectedRows
//     console.log(selectedRow)
//     const modalEdit = store?.modalEdit
//   // ** State
//   const [startDatePicker, setStartDatePicker] = useState(selectedRow?.start_date ?? new Date())
//   const userData = useUserData()

//   const handleModal = () => {
//     dispatch(setEditModal(!modalEdit))
//   }

//   // ** Custom close btn
//   const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

//   const [updateMilestone] = useMutation(UPDATE_MILESTONE, {
//     refetchQueries: [{query: GET_MILSTONE}],
//     onCompleted: (data) => {
//         dispatch(newRows(data.update_milestones.returning))
//         setTimeout(() => {
//           dispatch(resetDefault([]))
//         }, 2000);
//     }
//   })

//   const {data} = useQuery(GET_PROJECTS, {
//     onCompleted: () => {
//     },
//     onError: (error) => {
//       console.log(error)
//     }
//   })

//   const getProjectOptions = (project) => {
//     if (project) {
//       return  project?.map(project => {
//       return {...project, label: project.client_name, value: project.id}
//     })
//   }
//   }

//   const formatProjectOptions = ({ label, client_email }) => {
//     return (
//       <li style={{listStyle: "none"}}>
//         <span style={{marginRight: "10px"}}>{label}</span>
//         <Badge color='light-secondary'>
//           {client_email}
//         </Badge>
//     </li>
//   )
// }

// const colourStyles = {
//   multiValue: (styles) => {
//     const color = "#162f57"
//     return {
//       ...styles,
//       backgroundColor: color
//     }
//   }
// }

//   const addProjectSchema = yup.object().shape({
//     client_id: yup.object().shape({
//       label: yup.string().required('label is required'),
//       value: yup.string().required('value is required')
//     }),
//     description: yup.string().required('Milestone is a required field')
//   })

//   const defaultValues = {
//     description: "",
//     client_id: null
//   }
    
//   const {
//     control,
//     // setError,
//     reset,
//     clearErrors,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({ mode: 'onChange', resolver: yupResolver(addProjectSchema), defaultValues })
  
//   const onDiscard = () => {
//     clearErrors()
//     dispatch(setEditModal(false))
//     reset()
//   }

//   const onSubmit = async data => {
//     console.log(data)
//     const myData = {
//       description: data.description,
//       client_id: data.client_id.value
//     }
//     if (Object.values(data).every(field => field.toString().length > 0)) {
//       const {client_id, description} = myData
//       try {
//         await updateMilestone({
//           variables: {
//             id: selectedRow.id,
//             client_id,
//             description,
//             due_date: new Date(startDatePicker).toLocaleDateString().replaceAll("/", "-"),
//             updated_by: userData.email
//           }
//         })
//         dispatch(setEditModal(false))
//         reset()
//         toast.success("Milestone Updated",
//           {
//             duration: 2000
//           }
//         )
//       } catch (error) {
//         console.log(error)
//         toast.error("Error Updating Milestone",
//           {
//             duration: 2000
//           }
//         )
//       }
//     }
//   }
//   useEffect(() => {
//     const defaultValues = {
//       client_id: {label: selectedRow?.project?.client_name, value: selectedRow?.project?.id},
//       description: selectedRow?.milestone,
//     }
//   reset(defaultValues)
//   }, [selectedRow])
  

//   return (
//     <Modal
//       isOpen={modalEdit}
//       onClosed={onDiscard}
//       toggle={handleModal}
//       className='modal-dialog-centered modal-xl'
//       contentClassName='pt-0'
//     >
//       <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
//         <h5 className='modal-title'>Edit Record</h5>
//       </ModalHeader>
//       <ModalBody className='flex-grow-1'>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//       <div className='mb-1'>
//         <Label className='form-label' for='project-name'>Select Project</Label>
//         <Controller
//         control={control}
//         id="project-name"
//         name="client_id"
//         defaultValue={defaultValues.client_id}
//         render={({ field }) => (
//           <Select
//           {...field}
//           classNamePrefix='select'
//           options={getProjectOptions(data?.projects)}
//           formatOptionLabel={formatProjectOptions}
//           isClearable={false}
//           styles={colourStyles}
//           className={classnames('react-select', { 'is-invalid': data !== null && data?.id === null })}
//         />
//         )}
//           />        
//              {errors.client_id && <div><span>Project Name is a required field</span></div>}
//             </div>
//         <div className='mb-1'>
//           <Label className='form-label' for='description'>
//           Milestone
//           </Label>
//           <InputGroup>
//             <InputGroupText>
//               <Briefcase size={15} />
//             </InputGroupText>
//             <Controller
//               defaultValue={defaultValues.description}
//               control={control}
//               id='description'
//               name='description'
//               render={({ field }) => <Input id='description' placeholder='Add description of milestone' name="description" invalid={errors.description && true} {...field} />}
//             />
//             {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
//           </InputGroup>
//         </div>
   
  
//         <div className='mb-1'>
//           <Label className='form-label' for='project-start-date'>
//           Project Start Date
//           </Label>
//           <InputGroup>
//             <InputGroupText>
//               <Calendar size={15} />
//             </InputGroupText>
//               <Flatpickr className='form-control' id='project-start-date' value={startDatePicker} onChange={date => setStartDatePicker(date)}  />
//           </InputGroup>
//         </div>

//         <Button className='me-1' color='primary' type='submit'>
//           Save Changes
//         </Button>
//         <Button color='secondary' onClick={onDiscard} outline>
//           Cancel
//         </Button>
//       </Form>
//       </ModalBody>
//     </Modal>
//   )
// }

// export default EditModal
