"use client";
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';

const Unauthorized = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className='w-100 vh-100 d-flex flex-column gap-2 align-items-center justify-content-center'
    >
      <h1>404</h1>
      <h3>Halaman/Data Tidak Ditemukan</h3>
      <div className='d-flex flex-row gap-4'>
        <Button type='button' variant='primary' onClick={() => router.back()}>Back</Button>
      </div>
    </motion.div>
  )
}

export default Unauthorized