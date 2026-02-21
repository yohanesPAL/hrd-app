'use client'
import Image from 'next/image'
import { Accordion, Nav, Navbar, Stack } from 'react-bootstrap'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useNavbar from '@/stores/navbar/NavbarStore'
import { getMenu } from './SidebarMenu'
import { NavLink } from './NavLink'
import styles from './sidebar.module.css'

const SideBar = ({ role, namaKaryawan }: { role: string, namaKaryawan: string }) => {
  const route = usePathname();
  const Menu = getMenu(role);
  const isActive = (path: string) => route.startsWith(path);
  const showNavbar = useNavbar((state) => state.isShow);

  return (
    <Navbar expanded={showNavbar} style={{ background: 'var(--secondary)', color: "white", width: showNavbar ? "21rem" : "0rem" }} className={`py-0 overflow-hidden ${styles.sidebar}`}>
      {showNavbar &&
        <Stack gap={4}>
          <div>
            <Link href={`/${role}/dashboard`} style={{ height: "4rem", background: 'var(--primary)' }} className='d-flex align-items-center justify-content-center'>
              <h1>HR System</h1>
            </Link>
            <Link href={`/${role}/dashboard`} className='d-flex flex-row gap-3 align-items-center justify-content-center p-2 white-shade overflow-hidden' style={{ minWidth: "15rem", height: "5rem" }}>
              <Image alt='profile-picture' width={50} height={50} src={'/pp.webp'} className="rounded-circle" style={{ objectFit: 'cover' }} />
              <div className='d-flex flex-column align-items-start w-100 justify-content-center'>
                <span>{namaKaryawan}</span>
                <span>{role.toUpperCase()}</span>
              </div>
            </Link>
          </div>
          <Stack>
            {Menu.map((item) => {
              if (item.children) {
                return (
                  <Accordion key={item.nama} flush style={{ background: 'var(--secondary)' }}>
                    <Accordion.Item eventKey="0" style={{ background: 'var(--secondary)' }}>
                      <Accordion.Header className={`${styles.dropdownNavlink}`}>
                        <Stack direction='horizontal' gap={2}>
                          <i className={`bi ${item.icon}`}></i>
                          <span>{item.nama}</span>
                        </Stack>
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        <Nav className="flex-column" style={{ paddingLeft: "22px" }}>
                          {item.children.map((subMenu) => {
                            const href = `/${role}/${item.href}/${subMenu.href}`
                            return (
                              <NavLink
                                key={subMenu.nama}
                                nama={subMenu.nama}
                                icon={subMenu.icon}
                                href={href}
                                isActive={isActive(href)}
                              />
                            )
                          })}
                        </Nav>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )
              }
              
              const href = `/${role}/${item.href}`
              return (
                <NavLink
                  key={item.nama}
                  nama={item.nama}
                  icon={item.icon}
                  href={href}
                  isActive={isActive(href)}
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