import React from 'react'
import { Button } from 'react-bootstrap'
import { ButtonVariant } from 'react-bootstrap/esm/types'

const ButtonWithIcon = ({
  children,
  variant = "primary",
  iconClass,
  onClick
}: {
  children: React.ReactNode,
  variant?: ButtonVariant,
  iconClass: string,
  onClick?: () => void,
}) => {
  return (
    <Button type='button' onClick={onClick} variant={variant} style={{ paddingLeft: "10px" }}>
      <i className={iconClass}></i>
      <span style={{ marginLeft: "2px" }}>{children}</span>
    </Button>
  )
}

export default ButtonWithIcon