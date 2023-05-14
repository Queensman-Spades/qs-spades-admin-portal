import { Button } from 'reactstrap'
import { useParams } from 'react-router-dom'
import errorImg from '@src/assets/images/pages/error.svg'
// ** Configs
import themeConfig from '@configs/themeConfig'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNiceQuery, useNiceMutation } from '../utility/Utils'

const GET_JOB_TICKETS = gql`
query getJobTickets($callout_id: Int!) {
  job_tickets(order_by: {id: desc}, where: {callout: {status: {_eq: "Closed"}}, callout_id: {_eq: $callout_id}}) {
    id
    notes
    name
    callout_id
    description
    type
    worker_email
    worker_id
    status
    created_at
    start_time
    end_time
    worker_email_rel {
      full_name
    }
    callout {
      id
      property_id
      job_type
      description
      status
      request_time
      urgency_level
      picture1
      picture2
      picture3
      picture4
      video
      client: client_callout_email {
        id
        full_name
        email
        phone
      }
      job: callout_job {
        solution
        feedback
        rating
        resolved_time
      }
      property {
        id
        address
        community
        country
        city
      }
      schedulers {
        id
        date_on_calendar
        time_on_calendar
      }
      pre_pics {
        picture_location
      }
      postpics {
        picture_location
      }
      job_history {
        id
        location
        status_update
        time
      }
      job_type_rel {
        skill_parent_rel {
          skill_name
        }
      }
    }
  }
}
`


import '@styles/base/pages/page-misc.scss'
import TabsVerticalLeft from './TabsVerticalLeft'

const Job = () => {
  const {callout_id} = useParams()
  const { loading, data, error } = useNiceQuery(GET_JOB_TICKETS, {
    variables: {
      callout_id
    }
  })
  console.log(error)
  return (
    <div className='p-1'>
      <a href="/">
      <span className='brand-logo'>
                    <img src={themeConfig.app.appLogoImage} alt='logo' height="50px" />
                    <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>
                  </span>
                 
                  </a>
      <div className='misc-inner p-2 p-sm-3'>
      {data?.job_tickets.length > 0 ? loading ? <p>Loading </p> : <TabsVerticalLeft item={data?.job_tickets[0]} /> : <p>No data</p>}
      </div>
    </div>
  )
}
export default Job
