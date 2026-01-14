"use client";
import Image from 'next/image'
import React from 'react'
import { Nav, Navbar, Stack } from 'react-bootstrap'
import useNavbar from '@/stores/navbar/NavbarStore'

const TopBar = () => {
  const showNavbar = useNavbar((state) => state.setShow)
  const navbarState = useNavbar((state) => state.isShow)

  return (
    <div style={{ background: 'var(--primary)', color: "white", height: "4rem", padding: 0 }}>
      <Navbar className='w-100 h-100 white-shade d-flex align-items-center justify-content-between py-0'>
        <div onClick={() => showNavbar(!navbarState)} className='on-hover d-flex align-items-center justify-content-center' style={{ height: "100%", width: "4rem" }}>
          <i className="bi bi-list fs-3"></i>
        </div>
        <div className='d-flex flex-row align-items-center justify-content-center gap-2 on-hover'>
          <Image alt='profile-picture' width={40} height={40} src={'/pp.webp'} className="rounded-circle" style={{ objectFit: 'cover' }} />
          <i className="bi bi-chevron-down"></i>
        </div>
      </Navbar>
    </div>
  )
}

export default TopBar