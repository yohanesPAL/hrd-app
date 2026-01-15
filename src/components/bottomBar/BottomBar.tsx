"use client";
import { Navbar } from 'react-bootstrap'

const BottomBar = () => {
  return (
      <div style={{ background: 'white', color: "black", height: "4rem", padding: 0 }} className='border'>
        <Navbar className='w-100 h-100 white-shade d-flex align-items-center justify-content-between py-0 px-4'>
          <span>PT Perdhana Adhi Lestari | HRD System</span>
        </Navbar>
      </div>
  )
}

export default BottomBar