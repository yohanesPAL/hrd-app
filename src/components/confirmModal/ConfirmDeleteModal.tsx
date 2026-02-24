'use client';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap'

const ConfirmDeleteModal = () => {
  const { props, onConfirm, setClose, isPosting } = useConfirmDelete();

  const handleConfirm = () => {
    if(isPosting) return;
    if (!onConfirm) return;
    onConfirm(props.id);
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Enter' && !isPosting) {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPosting, onConfirm, props.id]);

  return (
    <Modal
      show={props.show}
      onHide={setClose}
    >
      <Modal.Header>
        <Modal.Title>Hapus <strong>{props.nama}</strong>?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span><strong>{props.nama}</strong> akan dihapus permanen!</span>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' variant='success' onClick={setClose} disabled={isPosting}>Kembali</Button>
        <Button type='button' variant='danger' onClick={handleConfirm} disabled={isPosting}>Hapus</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteModal