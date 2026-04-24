'use client';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap'

const ConfirmDeleteModal = () => {
  const { props, onConfirm, closeConfirmDelete, isSubmitting } = useConfirmDelete();

  const handleConfirm = () => {
    if (!onConfirm || isSubmitting) return;
    onConfirm(props.id);
    closeConfirmDelete();
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Enter' && !isSubmitting) {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onConfirm, props.id]);

  return (
    <Modal
      show={props.show}
      onHide={closeConfirmDelete}
    >
      <Modal.Header>
        <Modal.Title>Hapus <strong>{props.nama}</strong>?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span><strong>{props.nama}</strong> akan dihapus permanen!</span>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' variant='success' onClick={closeConfirmDelete} disabled={isSubmitting}>Kembali</Button>
        <Button type='button' variant='danger' onClick={handleConfirm} disabled={isSubmitting}>Hapus</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteModal