import React from 'react'
import SideBar from '@/components/sidebar/SideBar'
import TopBar from '@/components/topbar/TopBar'
import { Container } from 'react-bootstrap'

const Media = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-0 px-0 min-vh-100 w-100 d-flex flex-row'>
      <SideBar />
      <div className='d-flex flex-column w-100'>
        <TopBar />
        <Container className='min-h-100'>
          {children}
        </Container>
      </div>
    </div>
  )
}

export default Media