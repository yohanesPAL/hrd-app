'use client';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { Button, Modal } from 'react-bootstrap'

const ConfirmDeleteModal = () => {
  const { props, onConfirm, setClose, isPosting } = useConfirmDelete();

  const handleConfirm = () => {
    if (!onConfirm) return;
    onConfirm(props.id);
  }

  return (
    <Modal show={props.show}>
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