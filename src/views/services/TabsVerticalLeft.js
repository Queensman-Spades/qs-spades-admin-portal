import { useState } from 'react'
import AppCollapse from '@components/app-collapse'
import moment from "moment"
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem, Card  } from 'reactstrap'
import { Star } from 'react-feather'

const TabsVerticalLeft = ({item}) => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({data: jobHistory}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Status Update: </h5> 
      <h6 className='mb-1 ml-1'>{jobHistory?.status_update}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Updated By: </h5>
      <h6 className='mb-1 ml-1'>{jobHistory?.updated_by}</h6>
    </div>
    {jobHistory?.location && <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Location: </h5>
      <h6 className='mb-1 ml-1'><a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${JSON.parse(jobHistory?.location).coords?.latitude}%2C${JSON.parse(jobHistory?.location).coords?.longitude}`}>Click here to view location</a></h6>
    </div>}
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Updated At: </h5>
      <h6 className='mb-1 ml-1'>{moment(jobHistory?.time).format('MMMM Do YYYY, h:mm:ss a')}</h6>
    </div>
  </div>
  )

  const RowContentWorker = ({data: jobWorker}) => (
    <div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Name: </h5> 
      <h6 className='mb-1 ml-1'>{jobWorker?.full_name}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Email: </h5>
      <h6 className='mb-1 ml-1'>{jobWorker?.email}</h6>
    </div>
    <div className='meetup-header d-flex align-items-center'>
      <h5 className='mb-1'>Team ID: </h5>
      <h6 className='mb-1 ml-1'>{jobWorker?.team_id}</h6>
    </div>
  </div>
  )

  const CollapseDefault = ({ data }) => (
    <AppCollapse data={data} type="border" />
  )

  const PrePostImage = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     <a href={picture.picture_location} target="_blank"><img src={picture.picture_location} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, marginBottom: 2}}/></a>
     <p className="font-weight-bolder mb-0" style={{fontSize: 15, textAlign: "left", lineHeight: 1.5}}>Upload time: </p>
     <p className="" style={{fontSize: 15, textAlign: "left", lineHeight: 1.5}}>{moment(picture?.upload_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
     </div>
  }

  const CalloutPicture = ({picture}) => {
    return <div style={{width: "250px", margin:4}}>
     {picture ? <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "250px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10}}/></a> : <div style={{width: "100px", height: "100px", borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, display: "flex", justifyContent: "center", alignItems: "center"}}><p style={{fontSize: "12px", fontWeight: "bold", margin: 0}}>NO PICTURE</p></div>}
     
     </div>
  }

  const client = item?.client_callout_email
  const property = item?.property
  const services = item?.services
  const exterior_roof_top = item?.services?.exterior_roof_top
  const callout = item
  const pre_images = item?.pre_pics
  const post_images = item?.postpics
  const job_history = item?.job_history
  const job = item?.callout_job
  const job_worker = item?.job_worker
  const schedule = item?.schedulers[0]
  const location = job_history.filter(element => element.location !== null)[0]?.location
    const job_history_count = job_history.length
    const job_history_modified =
    job_history_count !== 0 ? job_history.map((jobHistory, i) => ({
      title: `History id: ${jobHistory.id}`,
      content: <RowContent data={jobHistory} count={job_history_count} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]

    const job_worker_count = job_worker.length
    const job_worker_modified =
    job_worker_count !== 0 ? job_worker.map((jobWorker, i) => ({
      title: `Worker id: ${jobWorker.worker.id}`,
      content: <RowContentWorker data={jobWorker.worker} count={job_worker_count} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]

  const ItemValue = ({item, itemKey}) => (
    <ListGroupItem>
    <span style={{fontWeight: "bold"}}>
      {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: </span> 
      { (itemKey === "request_time") ? moment(item[itemKey]).format('MMMM Do YYYY, h:mm:ss a') : item[itemKey] ? item[itemKey] : "N/A"}
    </ListGroupItem>
  )
  
  const servicesArrayNotIncluded = ["id", "job_parent", "job_parent", "job_type", "pre_pics", "post_pics", "exterior_roof_top", "pre_pics", "post_pics", "pre_pics2", "post_pics2"]
  const exteriorRoofTopArrayNotIncluded = ["job_type_id", "job_category_id", "pre_pics2", "post_pics2"]

  const ServiceValue = ({item, itemKey}) => {
    if (["pics_for_notes", "pics_for_readings", "pics_for_recommendations", "pre_pics", "post_pics", "pre_pics2", "post_pics2"].includes(itemKey)) {  
      if (item[itemKey]) {
        return (
          <ListGroupItem>
            <span style={{fontWeight: "bold"}}>{item[itemKey]?.description}: </span>
            {item?.[itemKey]?.value?.map((picture, i) => {
            return (
              <div style={{width: "150px", margin:4}}>
                <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "150px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, marginBottom: 2}}/></a>
              </div>
            )
          })}
          </ListGroupItem>
          )
      }
    }
    if (itemKey === "radio" && item[itemKey]) {  
      return (
        <div>
          {item?.[itemKey]?.map((radio, i) => {
          return (
            <ListGroupItem>
              <p><span style={{fontWeight: "bold"}}>Name: </span><span>{radio?.name}</span></p>
              <p><span style={{fontWeight: "bold"}}>Value: </span><span>{radio?.value}</span></p>
              <p className="mb-0"><span style={{fontWeight: "bold"}}>Level: </span><span>{radio?.level}</span></p>
              </ListGroupItem>
          )
        })}
        </div>
        )

    }
    if (itemKey === "checks" && item[itemKey]) {  
      return (
        <ListGroupItem>
          {item?.[itemKey]?.map((checked, i) => {
          return (
            <div>
              <p><span style={{fontWeight: "bold"}}>Name: </span><span>{checked?.name}</span></p>
              <p className="mb-0"><span style={{fontWeight: "bold"}}>Checked: </span><span>Yes</span></p>
            </div>
          )
        })}
        </ListGroupItem>
      )
    }
    if (!servicesArrayNotIncluded.includes(itemKey) && item[itemKey]) {
        return <ListGroupItem><span style={{fontWeight: "bold"}}>{item[itemKey]?.description}: </span><span>{item[itemKey]?.value}</span> </ListGroupItem>
    } else {
      return <></>
    }
  }
  const ExteriorRoofTop = ({item, itemKey}) => {

    if (["pre_pics", "post_pics", "pre_pics2", "post_pics2"].includes(itemKey)) {  
      console.log(item[itemKey])
      if (item[itemKey]) {
        return (
          <ListGroupItem>
            <span style={{fontWeight: "bold"}}>{item[itemKey]?.description}: </span>
            {item?.[itemKey]?.value?.map((picture, i) => {
            return (
              <div style={{width: "150px", margin:4}}>
                <a href={picture} target="_blank"><img src={picture} style={{width: "100%", height: "150px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, marginBottom: 2}}/></a>
              </div>
            )
          })}
          </ListGroupItem>
          )
      }
    }
    if (itemKey === "radio" && item[itemKey]) {  
      return (
        <div>
          {item?.[itemKey]?.map((radio, i) => {
          return (
            <ListGroupItem>
              <p><span style={{fontWeight: "bold"}}>Name: </span><span>{radio?.name}</span></p>
              <p><span style={{fontWeight: "bold"}}>Value: </span><span>{radio?.value}</span></p>
              <p className="mb-0"><span style={{fontWeight: "bold"}}>Level: </span><span>{radio?.level}</span></p>
              </ListGroupItem>
          )
        })}
        </div>
        )

    }
    if (itemKey === "checks" && item[itemKey]) {  
      return (
        <ListGroupItem>
          {item?.[itemKey]?.map((checked, i) => {
          return (
            <div>
              <p><span style={{fontWeight: "bold"}}>Name: </span><span>{checked?.name}</span></p>
              <p className="mb-0"><span style={{fontWeight: "bold"}}>Checked: </span><span>Yes</span></p>
            </div>
          )
        })}
        </ListGroupItem>
      )
    }
    if (!exteriorRoofTopArrayNotIncluded.includes(itemKey) && item[itemKey]) {
      console.log("AAAAAAAAAAAA")
      console.log(itemKey, "asdas")
        return <ListGroupItem><span style={{fontWeight: "bold"}}>{item[itemKey]?.description}: </span><span>{item[itemKey]?.value}</span> </ListGroupItem>
    } else {
      return <></>
    }
  }
  return (
    <div className='nav-vertical'>
      <Nav tabs className='nav-left'>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Callout Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Client Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Job Worker
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Property Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '5'}
            onClick={() => {
              toggle('5')
            }}
          >
            Scheduled Time
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '6'}
            onClick={() => {
              toggle('6')
            }}
          >
            Pre Images
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '7'}
            onClick={() => {
              toggle('7')
            }}
          >
            Post Images
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '8'}
            onClick={() => {
              toggle('8')
            }}
          >
            Job History
          </NavLink>
        </NavItem>
        <>
        {services && <NavItem>
          <NavLink
            active={active === '10'}
            onClick={() => {
              toggle('10')
            }}
          >
            Services
          </NavLink>
          </NavItem>
          }
          </>
        <NavItem>
          <NavLink
            active={active === '9'}
            onClick={() => {
              toggle('9')
            }}
          >
            Location
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
      <TabPane tabId='1'>
        <h1>Callout Details <span className="font-medium-2">({callout.status})</span></h1>
            <ListGroup flush>
            {callout && Object.keys(callout).map(itemKey => {
              if (!(["callout_job", "client_callout_email", "job_history", "job_worker", "property", "postpics", "pre_pics", "__typename", "schedulers", "services", "category", "active"].includes(itemKey))) {
                if ((["picture1", "picture2", "picture3", "picture4"].includes(itemKey))) {
                  return (
                    <CalloutPicture key={itemKey} picture={callout[itemKey]} />
                  )
                } 
                if ((["video"].includes(itemKey))) {
                  return (
                    <div>
                      <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 10}}>Video: </p>
                      {callout[itemKey] === "" ? <p>No video</p> : <video width="250" controls src={callout[itemKey]} />}
                   </div>
                  )
                }
                  return (
                    <ItemValue item={callout} itemKey={itemKey} />
                  )
              }
              })}
               <div>
          <p style={{fontWeight: "bold", fontSize: 18, margin: 0, marginTop: 20}}>Feedback for all the tickets in this job</p>  
              
        {job.length > 0 ? job?.map(_job => {
            return <div>
            <p style={{fontWeight: "bold", fontSize: 14, margin: 0, marginTop: 10}}>Solution: </p>
            {_job?.solution}

            <p style={{fontWeight: "bold", fontSize: 14, margin: 0, marginTop: 10}}>Feedback: </p>
            {_job?.feedback === "" ? "No Feedback" : _job?.feedback}

            <p style={{fontWeight: "bold", fontSize: 14, margin: 0, marginTop: 10}}>Rating: </p>
            {/* {_job?.rating} / 5 */}
            {[...Array(_job?.rating)].map(_ => (
            <Star fill="#6e6b7b" />
            ))}
            {[...Array((5 - _job?.rating))].map(_ => (
            <Star />
            ))}
            </div>
        }) : <div>Job is still open or inprogress</div>}
        </div>
            </ListGroup>
        </TabPane>
        <TabPane tabId='2'>
        <h1>Client Details</h1>
            <ListGroup flush>
               {client && Object.keys(client).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                    <ItemValue item={client} itemKey={itemKey} />
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='3'>
        <h1>Job Worker Details</h1>
        <CollapseDefault data={job_worker_modified} />
        </TabPane>
        <TabPane tabId='4'>
        <h1>Property Details</h1>
            <ListGroup flush>
               {property && Object.keys(property).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                    <ItemValue item={property} itemKey={itemKey} />
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='5'>
        <h1>Schedule Details</h1>
            <ListGroup flush>
            {schedule && Object.keys(schedule).map(itemKey => {
              if (!(["__typename"].includes(itemKey))) {
                  return (
                    <ItemValue item={schedule} itemKey={itemKey} />
                  )
              }
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='6'>
        <h1>Pre Images</h1>
            {pre_images.length > 0 ? pre_images.map((preImage, i) => (
              <PrePostImage key={i} picture={preImage} />
            )) : <div>No images</div>}
        </TabPane>
        <TabPane tabId='7'>
        <h1>Post Images</h1>
        {post_images.length > 0 ? post_images.map((postImages, i) => (
              <PrePostImage key={i} picture={postImages} />
            )) : <div>No images</div>}
        </TabPane>
        <TabPane tabId='8'>
        <h1>Job History Details</h1>
        <CollapseDefault data={job_history_modified} />
        </TabPane>
        <TabPane tabId='10'>
        <h1>Services Details</h1>
        <h4>Job Category: {services?.job_parent.skill_name}</h4>
        <h4>Job Type: {services?.job_type.skill_name}</h4>
            <ListGroup flush>
               {exterior_roof_top && Object.keys(exterior_roof_top).map(itemKey => {
                  if (!(["__typename"].includes(itemKey))) {
                      return (
                        // <ListGroupItem>
                        <ExteriorRoofTop item={exterior_roof_top} itemKey={itemKey} />
                        // </ListGroupItem>
                      )
                  }             
              })}
               {services && Object.keys(services).map(itemKey => {
                  if (!(["__typename", "exterior_roof_top"].includes(itemKey))) {
                      return (
                        // <ListGroupItem>
                        <ServiceValue item={services} itemKey={itemKey} />
                        // </ListGroupItem>
                      )
                  }             
              })}
            </ListGroup>
        </TabPane>
        <TabPane tabId='9'>
        <h1>Location</h1>
        {location ? <h6 className='mb-1'><a target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${JSON.parse(location).coords?.latitude}%2C${JSON.parse(location).coords?.longitude}`}>Click here to view location</a></h6> : <h6>Location unavailable</h6>}
        </TabPane>
      </TabContent>
    </div>
  )
}
export default TabsVerticalLeft
