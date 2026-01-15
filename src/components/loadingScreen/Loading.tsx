"use client";
import useLoading from "@/stores/loading/LoadingStore"
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { HashLoader } from "react-spinners"

const Loading = () => {
  const isLoading = useLoading((state) => state.isLoading)
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return

  return (
    <Modal
      show={isLoading}
      centered
      backdrop="static"
      keyboard={false}
      contentClassName="bg-transparent border-0"
    >
      <div className="d-flex flex-column justify-content-center align-items-center">
        <HashLoader size={40} />
        <span className="mt-3 text-white">Loading...</span>
      </div>
    </Modal>
  )
}

export default Loading