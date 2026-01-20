"use client";
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { signOut } from "next-auth/react";
import { toast } from 'react-toastify';

const Unauthorized = () => {
  const router = useRouter();
  const [processLogout, setProcessLogout] = useState<boolean>(false);


  const relog = async () => {
    setProcessLogout(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className='w-100 vh-100 d-flex flex-column gap-2 align-items-center justify-content-center'
    >
      <h1>401</h1>
      <h3>Unauthorized</h3>
      <div className='d-flex flex-row gap-4'>
        <Button type='button' variant='primary' onClick={() => router.back()}>Back</Button>
        <Button type='button' variant='danger' className={`${processLogout && 'disabled'}`} onClick={relog}>Login</Button>
      </div>
    </motion.div>
  )
}

export default Unauthorized