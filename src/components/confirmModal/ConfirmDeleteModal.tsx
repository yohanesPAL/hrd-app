import { Dispatch, SetStateAction } from 'react'
import { Button, Modal } from 'react-bootstrap'

interface Props {
  nama: string;
  id: string;
  show: boolean;
}

const ConfirmModal = (
  {
    props,
    setClose,
    onConfirm,
    isPosting,
  }: {
    props: Props,
    setClose: () => void,
    onConfirm: (id: string) => void,
    isPosting: boolean
  }) => {

  return (
    <Modal show={props.show}>
      <Modal.Header>
        <Modal.Title>Hapus <strong>{props.nama}</strong>?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span><strong>{props.nama}</strong> akan dihapus permanen!</span>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' variant='success' onClick={setClose}>Kembali</Button>
        <Button type='button' variant='danger' onClick={() => onConfirm(props.id)} disabled={isPosting}>Hapus</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal