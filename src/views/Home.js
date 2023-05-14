import { Fragment, useContext, useEffect, useState } from 'react'
import { Row, Col, FormGroup, Card, CardHeader, CardSubtitle, CardTitle, Spinner, Button, CardBody } from 'reactstrap'
import { kFormatter } from '@utils'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import OrdersReceived from './OrdersReceived'
import SupportTracker from './SupportTracker'
import SubscribersGained from './SubscribersGained'
import Flatpickr from 'react-flatpickr'
import BarChart from './BarChart'
import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'
import { useRTL } from '@hooks/useRTL'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNiceLazyQuery, useNiceQuery } from '../utility/Utils'
import moment from 'moment'
import { Calendar } from 'react-feather'

const STATS = gql`query MyQuery {
  callout: callout_aggregate {
    aggregate {
      count
    }
  }
  closed: job_tickets_aggregate(where: {status: {_eq: "Closed"}}) {
    aggregate {
      count
    }
  }
  client: client_aggregate {
    aggregate {
      count
    }
  }
  property: property_aggregate {
    aggregate {
      count
    }
  }
}
`
const GET_CALLOUT_COUNT_TODAY = gql`
query CalloutsToday($endDate: timestamptz!, $startDate: timestamptz!) {
  callout(where: {request_time: {_lte: $endDate, _gte: $startDate}}, order_by: {id: desc}) {
    id
    callout_by_email
    property_id
    job_type
    urgency_level
    category
    active
    request_time
    status
    description
    picture1
    picture2
    picture3
    picture4
    video
    property {
      id
      city
      country
      community
      address
      comments
      type
    }
    client_callout_email {
      id
      full_name
      email
    }
    pre_pics {
      picture_location
      id
    }
    postpics {
      id
      picture_location
    }
    job_history {
      id
      updated_by
      status_update
      time
      location
    }
    job_worker {
      worker {
        id
        full_name
        email
        team_id
      }
    }
    callout_job {
      feedback
      instructions
      rating
      signature
      solution
    }
    schedulers {
      id
      date_on_calendar
      time_on_calendar
    }
  }
}
`

const Home = () => {
  const { colors } = useContext(ThemeColors)
  const { loading, data: apiData, error } = useNiceQuery(STATS)
  const [isRtl, setIsRtl] = useRTL()
  const [countArray, setcountArray]  = useState([])
  const [countArray2, setcountArray2]  = useState([])
  const [countArray3, setcountArray3]  = useState([])
  const [picker, setPicker] = useState([moment().subtract(7, 'days').toDate(), moment().toDate()]) //last 7 days defualt
  const [calloutModifiedData, setCalloutModifiedData] = useState([])

  const getDaysArray = (dateArray) => {
    const start = dateArray[0]
    const end = dateArray[1]
    const arr = []
    const arr2 = []
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(moment(new Date(dt)).format("ddd, DD"))
        arr2.push(moment(new Date(dt)).format("YYYY-MM-DD"))
    }
    return { arr, arr2 }
  }
  const [dateArray, setDateArray] = useState(getDaysArray(picker))
  const [myData, setMyData] = useState(null)
  const [getCallOuts, { loading: calloutLoading, data: calloutData, error: calloutError }] = useNiceLazyQuery(GET_CALLOUT_COUNT_TODAY, 
    {
      variables: {
        endDate: picker[1], 
        startDate: picker[0]
      },
      onCompleted: (data) => {
        setMyData(data)
        const modifiedData = data?.callout
      setcountArray(dateArray.arr.map(date => {      //Closed 
      return modifiedData.filter(element => moment(element.request_time).format("ddd, DD") === date && element.status === "Closed").length
      }))
      setcountArray2(dateArray.arr.map(date => {      //Open
        return modifiedData.filter(element => moment(element.request_time).format("ddd, DD") === date && element.status === "Open").length
      }))
      setcountArray3(dateArray.arr.map(date => {      //Inporgress
        return modifiedData.filter(element => moment(element.request_time).format("ddd, DD") === date && element.status === "In Progress").length
      }))
      }
    }
    )

    let Closed = 0
    if (countArray?.length > 0) {
      Closed = countArray.reduce((accumulator, current) => {
        return accumulator + current 
      })
    }
    let Open = 0
    if (countArray2?.length > 0) {
      Open = countArray2.reduce((accumulator, current) => {
        return accumulator + current 
      })
    }
    let Progress = 0
    if (countArray3?.length > 0) {
      Progress = countArray3.reduce((accumulator, current) => {
        return accumulator + current 
      })
    }
  useEffect(() => {
    getCallOuts()
  }, [])
  

  return (
    <Fragment>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} apiData={apiData} error={error} loading={loading} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' sm='6'>
        <Card>
      <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
        <div>
          {picker[1] ? <>
          <div className='d-flex'>
            <div className='pr-2'>
          <CardSubtitle className='text-muted mb-25'>Open Callouts in the set range</CardSubtitle>
          <CardTitle className='font-weight-bolder' tag='h4'>
            {Open}
          </CardTitle>
          </div>
          <div className='pr-2'>
          <CardSubtitle className='text-muted mb-25'>Closed Callouts in the set range</CardSubtitle>
          <CardTitle className='font-weight-bolder' tag='h4'>
            {Closed}
          </CardTitle>
          </div>
          <div className='pr-2'>
          <CardSubtitle className='text-muted mb-25'>In Progress in the set range</CardSubtitle>
          <CardTitle className='font-weight-bolder' tag='h4'>
            {Progress}
          </CardTitle>
          </div>
          
          </div>
          <div className='mt-2'>
          <CardSubtitle className='text-muted mb-25'>Total callouts in the set range</CardSubtitle>
          <CardTitle className='font-weight-bolder' tag='h4'>
            {Open + Progress + Closed}
          </CardTitle>
          </div>
          </> : <Spinner color="primary" className="mt-1" />}
        </div>
        <div className='d-flex align-items-center mt-md-0 mt-1'>
        <Calendar size={17} />
            <Flatpickr
            options={{
              mode: 'range'
            }}
            onChange={date => { setPicker(date); setDateArray(getDaysArray(date)) }}
            value={picker}
            className='form-control flat-picker bg-transparent border-0 shadow-none'
          />
          <Button onClick={() => getCallOuts()}>Ok</Button>
          </div>
          
      </CardHeader>
      <CardBody>
      {loading ? <div>Loading</div> : <BarChart direction={isRtl ? 'rtl' : 'ltr'} info={colors.info.main} picker={picker} dateArray={dateArray} countArray={countArray} countArray2={countArray2} countArray3={countArray3} data={calloutData} calloutModifiedData={calloutModifiedData} setCalloutModifiedData={setCalloutModifiedData}/> }
      </CardBody>
    </Card>
        </Col>
        {/* <Col lg='12' sm='6'>
          <ApexColumnCharts direction={isRtl ? 'rtl' : 'ltr'} info={colors.info.main} />
        </Col> */}
        {/* <Col lg='3' sm='6'>
          <OrdersReceived kFormatter={kFormatter} warning={colors.warning.main} />
        </Col> */}
      </Row>
      <Row>
        <Col lg='12' sm="6">
          <SupportTracker primary={colors.primary.main} danger={colors.danger.main} />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Home
