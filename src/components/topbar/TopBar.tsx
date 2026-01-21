"use client";
import Image from 'next/image'
import { Button, Dropdown, DropdownDivider, DropdownMenu, DropdownToggle, Navbar } from 'react-bootstrap'
import useNavbar from '@/stores/navbar/NavbarStore'
import { signOut } from "next-auth/react";
import { useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

const TopBar = ({ role, karyawanId }: { role: string, karyawanId: string }) => {
  const showNavbar = useNavbar((state) => state.setShow);
  const navbarState = useNavbar((state) => state.isShow);
  const [processLogout, setProcessLogout] = useState<boolean>(false);

  const onLogout = async () => {
    setProcessLogout(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <>
      <div style={{ background: 'var(--primary)', color: "white", height: "4rem", padding: 0 }}>
        <Navbar className='w-100 h-100 white-shade d-flex align-items-center justify-content-between py-0'>
          <div onClick={() => showNavbar(!navbarState)} className='on-hover d-flex align-items-center justify-content-center' style={{ height: "100%", width: "4rem" }}>
            <i className="bi bi-list fs-3"></i>
          </div>
          <Dropdown align={'end'} className='h-100'>
            <DropdownToggle className='d-flex flex-row align-items-center justify-content-center gap-2 h-100 px-3 py-0 bg-transparent border-0 on-hover'>
              <Image alt='profile-picture' width={40} height={40} src={'/pp.webp'} className="rounded-circle" style={{ objectFit: 'cover' }} />
            </DropdownToggle>
            <DropdownMenu style={{ right: 0, transform: "translateX(-10px)", width: "250px" }} className='p-2 text-end bg-white'>
              <div className='d-flex flex-column justify-content-center align-items-end'>
                <span>Akbar Maulana | HRD</span>
                <span>PT Perdana Adhi Lestari</span>
              </div>
              <DropdownDivider />
              <div className='d-flex flex-row justify-content-between align-items-center'>
                <Link href={`/media/${role}/profile/${karyawanId}`}>
                  <Button type='button' variant='primary'>Profile</Button>
                </Link>
                <Button type='button' variant='danger' className={`${processLogout && "disabled"}`} onClick={onLogout}>Logout</Button>
              </div>
            </DropdownMenu>
          </Dropdown>
        </Navbar>
      </div>
    </>
  )
}

export default TopBar