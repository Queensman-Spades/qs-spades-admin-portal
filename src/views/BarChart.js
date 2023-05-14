import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import { Calendar, Info } from 'react-feather'
import { useHistory } from 'react-router-dom'
import AppCollapse from '@components/app-collapse'
import { Fragment, useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Label, Spinner, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import moment from "moment"
import CalloutModal from "./CalloutModal" 
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { useNiceLazyQuery, useNiceQuery } from '../utility/Utils'

const BarChart = ({ info, direction, picker, dateArray, countArray, countArray2, countArray3, data, calloutModifiedData, setCalloutModifiedData}) => {
  const history = useHistory()
  const [calloutModal, setCalloutModal] = useState(false)
  const [calloutModal2, setCalloutModal2] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)
  console.log(data)
    //** Function to open details modal */
    const openModal = () => {
      setCalloutModal(true)
    }
    const openCalloutModal = (item) => {
      setCalloutModal2(true)
      setModalDetails(item) //set row value 
    }
    const CollapseDefault = ({ data }) => (
      <AppCollapse data={data} type="border" />
    )

    const RowContent = ({data: callout}) => (
      <div>
      <div className='meetup-header d-flex align-items-center'>
        <h5 className='mb-1'>Email: </h5> 
        <h6 className='mb-1 ml-1'>{callout?.callout_by_email}</h6>
      </div>
      <div className='meetup-header d-flex align-items-center'>
        <h5 className='mb-1'>Request Time: </h5>
        <h6 className='mb-1 ml-1'>{moment(callout?.request_time).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      </div>
      <div className='meetup-header d-flex align-items-center'>
        <h5 className='mb-1'>Status: </h5>
        <h6 className='mb-1 ml-1'>{callout.status}</h6>
      </div>
      <div className='meetup-header d-flex align-items-center'>
      <Button color='info' className="mx-2" onClick={() => { openCalloutModal(callout) }} size="sm">
  <span className='align-middle mr-50'>View Details</span>
    <Info size={15} />
  </Button>
  <Button color='primary' className="mx-2" onClick={() => { history.push({ pathname: '/schedule', state: { changeToDayView: true, date: callout?.schedulers?.[0]?.date_on_calendar } }) }} size="sm">
  <span className='align-middle mr-50'>View on Calendar</span>
    <Info size={15} />
  </Button>
      </div>
    </div>
    )

  const columnColors = {
    series1: '#28c76f', //Closed
    series2: '#ea5455', //Open
    series3: '#ff9f43' //In Progress
  }
  
  const doSomething = (date, index) => {
    console.log(index)
    console.log(data?.callout)
    let newData = [] 
    if (index === 0) { //Closed
      newData = data?.callout.filter((data) => moment(data.request_time).format("YYYY-MM-DD") === date && data.status === "Closed")
    } 
    if (index === 1) { //Open
      newData = data?.callout.filter((data) => moment(data.request_time).format("YYYY-MM-DD") === date && data.status === "Open")
    }
    if (index === 2) { //In Progress
      newData = data?.callout.filter((data) => moment(data.request_time).format("YYYY-MM-DD") === date && data.status === "In Progress")
    }
    const callout_count = newData?.length
    setCalloutModifiedData(
      callout_count !== 0 ? newData?.map((data, i) => ({
      title: `Callout id: ${data.id}  Callout by: ${data.callout_by_email}`,
      content: <RowContent data={data} count={callout_count} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]
    )
    openModal()
  }
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const index = config.seriesIndex
          const date = moment(dateArray.arr2[config.dataPointIndex]).format("YYYY-MM-DD")
          doSomething(date, index)
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        endingShape: 'rounded'
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: [columnColors.series1, columnColors.series2, columnColors.series3],
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dateArray.arr
    },
    yaxis: {
      opposite: direction === 'rtl'
    }
  }

  const series = [
    {
      name: "Closed",
      data: countArray
    },
    {
      name: "Open",
      data: countArray2
    },
    {
      name: "In Progress",
      data: countArray3
    }
  ]

  return (
    <>
    {picker[1] ? <Chart options={options} series={series} type='bar' height={400} />  :  <div style={{height: 400, display: "flex", flexDirection: "column", alignItems:"center", alignContent: "center", justifyContent: "center"}}>
      <div className="mb-2"><Spinner color='primary' /></div>
      <div><h6>Select End date</h6></div>
      </div>}
    <div className='vertically-centered-modal'>
        <Modal isOpen={calloutModal} toggle={() => setCalloutModal(!calloutModal)} className='modal-dialog-centered modal-xl'>
          <ModalHeader className="d-flex justify-content-center" toggle={() => setCalloutModal(!calloutModal)}>Callout Details</ModalHeader>
          <ModalBody>
          <h1>Callout Details</h1>
            <CollapseDefault data={calloutModifiedData} />
              <Modal isOpen={calloutModal2} toggle={() => setCalloutModal2(!calloutModal2)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className="d-flex justify-content-center" toggle={() => setCalloutModal2(!calloutModal2)}>Callout Details</ModalHeader>
                  <ModalBody>
                    <CalloutModal item={modalDetails} />
                  </ModalBody>
              </Modal>
          </ModalBody>
        </Modal>
      </div>
    </>
  )
}

export default BarChart
