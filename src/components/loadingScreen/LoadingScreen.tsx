'use client';
import { Modal } from "react-bootstrap";
import LoadingComp from "./Loading";

const LoadingScreen = ({ show = true }: { show?: boolean }) => {
  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="bg-transparent border-0"
    >
      <LoadingComp />
    </Modal>
  )
}

export default LoadingScreen