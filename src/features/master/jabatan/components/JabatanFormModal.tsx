"use client";
import { DivisionTable } from '@/modules/master/divisi/division.schema';
import { PositionForm } from '@/modules/master/jabatan/jabatan.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';

const JabatanFormModal = ({
  show,
  onCloseModal,
  onSubmit,
  jabatanForm,
  setJabatanForm,
  divisiList,
  isPosting,
}:{
  show: boolean,
  onCloseModal: () => void,
  onSubmit: (payload: PositionForm) => void,
  jabatanForm: PositionForm,
  setJabatanForm: Dispatch<SetStateAction<PositionForm>>,
  divisiList: DivisionTable[],
  isPosting: boolean,
}) => {
  return (
    <Modal show={show} onHide={onCloseModal}>
        <Form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(jabatanForm);
        }}>
          <Modal.Header closeButton>
            <Modal.Title>{!jabatanForm.id ? "Tambah" : "Edit"} Jabatan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label>Nama Jabatan</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ex: Admin'
                  required
                  value={jabatanForm.nama}
                  onChange={(e) => setJabatanForm({ ...jabatanForm, nama: e.currentTarget.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={jabatanForm.is_active ? 1 : 0}
                  onChange={(e) => setJabatanForm({ ...jabatanForm, is_active: e.currentTarget.value === "1" })}
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Non Aktif</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Divisi</Form.Label>
                <Form.Select
                  required
                  value={jabatanForm.id_divisi}
                  onChange={(e) => setJabatanForm({ ...jabatanForm, id_divisi: e.currentTarget.value })}
                >
                  <option value={""}>--Pilih Divisi--</option>
                  {
                    divisiList?.map((item) => (
                      <option key={item.id} value={item.id}>{item.nama}</option>
                    ))
                  }
                </Form.Select>
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type='button' variant='danger' disabled={isPosting} onClick={onCloseModal}>Batal</Button>
            <Button type='submit' variant='primary' disabled={isPosting}>{!jabatanForm.id ? "Submit" : "Update"}</Button>
          </Modal.Footer>
        </Form>
      </Modal >
  )
}

export default JabatanFormModal