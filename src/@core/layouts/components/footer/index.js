// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://taskmate-spades.vercel.app/home' target='_blank' rel='noopener noreferrer'>
          Task Mate
        </a>
        <span className='d-none d-sm-inline-block mr-xl-3'>, All rights Reserved</span>
        <span className='d-none d-sm-inline-block font-weight-bold'>Version: <span>2 - 2.11.2</span></span>
      </span>
      <span className='float-md-right d-none d-md-block'>
        Hand-crafted & Made with
        <Heart size={14} />
      </span>
      
    </p>
  )
}

export default Footer
