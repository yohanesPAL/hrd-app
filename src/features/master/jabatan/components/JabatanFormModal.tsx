"use client";
import { DivisionTable } from '@/modules/master/divisi/division.schema';
import { PositionForm } from '@/modules/master/jabatan/jabatan.schema';
import { Dispatch, SetStateAction } from 'react';
import { Button, Form, Modal, Stack } from 'react-bootstrap';

const JabatanFormModal = ({
 modal,
 jabatan,
 divisiList,
 isPending,
}:{
  modal: {
    show: boolean,
    onClosed: () => void,
  },
  jabatan: {
    onSubmit: (data: PositionForm) => void,
    form: PositionForm,
    setForm: Dispatch<SetStateAction<PositionForm>>,
    onEdit: string,
  }
  divisiList: DivisionTable[],
  isPending: boolean,
}) => {
  return (
    <Modal show={modal.show} onHide={modal.onClosed}>
        <Form onSubmit={(e) => {
          e.preventDefault();
          jabatan.onSubmit(jabatan.form);
        }}>
          <Modal.Header closeButton>
            <Modal.Title>{jabatan.onEdit === "" ? "Tambah" : "Edit"} Jabatan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label>Nama Jabatan</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ex: Admin'
                  required
                  value={jabatan.form.nama}
                  onChange={(e) => jabatan.setForm(prev => ({ ...prev, nama: e.target.value }))}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={jabatan.form.is_active}
                  onChange={(e) => jabatan.setForm(prev => ({ ...prev, is_active: Number(e.target.value) }))}
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Non Aktif</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Divisi</Form.Label>
                <Form.Select
                  required
                  value={jabatan.form.id_divisi}
                  onChange={(e) => jabatan.setForm(prev => ({ ...prev, id_divisi: e.target.value }))}
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
            <Button type='button' variant='danger' disabled={isPending} onClick={modal.onClosed}>Batal</Button>
            <Button type='submit' variant='primary' disabled={isPending}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal >
  )
}

export default JabatanFormModal