import Link from "next/link"
import React from "react"
import { Nav } from "react-bootstrap"
import styles from './sidebar.module.css'

export const NavLink = React.memo(
  ({ nama, icon, href, isActive }: { nama: string, icon: string, href: string, isActive: boolean }) => {
    return (
      <Link href={href} className="text-decoration-none">
        <Nav.Link
          as="span"
          className={`d-flex w-100 flex-row gap-2 justify-content-start align-items-center ${styles.navlink} ${isActive ? styles.active : ''}`}
        >
          <i className={`bi ${icon}`}></i>
          <span>{nama}</span>
        </Nav.Link>
      </Link>
    )
  }
)