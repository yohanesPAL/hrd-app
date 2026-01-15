'use client';
import useLoading from "@/stores/loading/LoadingStore";
import { Modal } from "react-bootstrap";
import LoadingComp from "./Loading";

const LoadingScreen = () => {
  const isLoading = useLoading((state) => state.isLoading)
  return (
    <Modal
      show={isLoading}
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