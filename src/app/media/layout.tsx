'use client';
import React from 'react'
import SideBar from '@/components/sidebar/SideBar'
import TopBar from '@/components/topbar/TopBar'
import { Container } from 'react-bootstrap'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation';

const Media = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <div className='mx-0 px-0 min-vh-100 w-100 d-flex flex-row'>
      <SideBar />
      <div className='d-flex flex-column w-100'>
        <TopBar />
        <Container className='min-h-100'>
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </Container>
      </div>
    </div>
  )
}

export default Media