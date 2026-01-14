'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Nav, Navbar, Stack } from 'react-bootstrap'
import Menu from './SideBarMenu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useNavbar from '@/stores/navbar/NavbarStore'
import styles from './sidebar.module.css'

const NavLink = React.memo(
  ({ nama, icon, isActive }: { nama: string, icon: string, isActive: boolean }) => {
    return (
      <Nav.Link as={Link} href={`/media/${nama.toLowerCase()}`} className={`d-flex w-100 flex-row gap-2 justify-content-start align-items-center ${styles.navlink} ${isActive ? styles.active : ''}`}>
        <i className={`bi ${icon}`}></i>
        <span>{nama}</span>
      </Nav.Link>
    )
  }
)

const SideBar = () => {
  const route = usePathname();
  const isActive = (path: string) => route.startsWith(path)
  const showNavbar = useNavbar((state) => state.isShow);

  return (
    <Navbar expanded={showNavbar} style={{ background: 'var(--secondary)', color: "white", width: showNavbar ? "21rem" : "0rem" }} className={`py-0 overflow-hidden ${styles.sidebar}`}>
      {showNavbar &&
        <Stack gap={4}>
          <div>
            <Link href='/media/dashboard' style={{ height: "4rem", background: 'var(--primary)' }} className='d-flex align-items-center justify-content-center'>
              <h1>HR System</h1>
            </Link>
            <Link href='/media/dashboard' className='d-flex flex-row gap-3 align-items-center justify-content-center p-2 white-shade overflow-hidden' style={{ minWidth: "15rem", height: "5rem" }}>
              <Image alt='profile-picture' width={50} height={50} src={'/pp.webp'} className="rounded-circle" style={{ objectFit: 'cover' }} />
              <div className='d-flex flex-column align-items-start w-100 justify-content-center'>
                <span>Akbar Maulana</span>
                <span>HRD</span>
              </div>
            </Link>
          </div>
          <Stack>
            {Menu.map((item) => {
              return (
                <NavLink
                  key={item.nama}
                  nama={item.nama}
                  icon={item.icon}
                  isActive={isActive(`/media/${item.nama.toLowerCase()}`)}
                />
              )
            })}
          </Stack>
        </Stack>
      }
    </Navbar>
  )
}

export default SideBar