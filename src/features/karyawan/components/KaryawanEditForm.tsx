'use client';
import { useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useProfile from '@/stores/profile/profile.store';
import { BaseEmployee, EmployeeForm, EmployeeUpdate } from '@/modules/employee/employee.schema';
import { KaryawanFormOptions } from '../types/KaryawanTypes';
import { updateKaryawanAction } from '../KaryawanAction';
import { useActionHandler } from '@/hooks/useActionHandler';

const KaryawanEditForm = ({ id, karyawanData, formOptions }: { id: BaseEmployee["id"], karyawanData: EmployeeUpdate, formOptions: KaryawanFormOptions }) => {
  const router = useRouter()
  const role = useProfile((state) => state.profile?.role)
  const { run } = useActionHandler();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [employeeForm, setEmployeeForm] = useState<EmployeeUpdate>(karyawanData)

  const onSubmit = async () => {
    if (!id) return toast.error("id tidak ditemukan");

    setSubmitting(true);
    try {
      await run(updateKaryawanAction, [id, employeeForm], {
        toast: {
          pending: "Update karyawan...",
          success: "Berhasil update karyawan...",
          error: "Ooops... ada yang salah",
        }
      })

      router.push(`/${role}/karyawan`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h2 className='mb-4'>Form Karyawan</h2>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}>
        <Stack gap={4}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>NIK</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 1812345678902049'
                maxLength={16}
                required
                value={employeeForm.nik}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, nik: e.target.value }))}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Jhon Doe'
                required
                value={employeeForm.nama}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, nama: e.target.value }))}
              />
            </Form.Group>
          </Row>
          <Form.Group>
            <Form.Label>Alamat</Form.Label>
            <Form.Control
              type='text'
              placeholder='Ex: Jl. Soekarno Hatta No 100'
              required
              value={employeeForm.alamat}
              onChange={(e) => setEmployeeForm(prev => ({ ...prev, alamat: e.target.value }))}
            />
          </Form.Group>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select
                required
                value={employeeForm.jk}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, jk: e.target.value as EmployeeUpdate["jk"] }))}
              >
                <option value={"Pria"}>Pria</option>
                <option value={"Wanita"}>Wanita</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>HP</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 081234567890/+6281234567890'
                value={employeeForm.hp}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, hp: e.target.value }))}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Divisi</Form.Label>
              <Form.Select
                required
                value={employeeForm.divisi}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, divisi: e.target.value }))}
              >
                {formOptions.activeDivision.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                required
                value={employeeForm.jabatan || ""}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, jabatan: e.target.value }))}
              >
                <option value={""}>-- Pilih Jabatan --</option>
                {formOptions.activePosition.filter((item) => item.id_divisi === employeeForm.divisi).map((item) => (
                  <option key={item.id} value={String(item.id)}>{item.nama}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Status Aktif</Form.Label>
              <Form.Select
                required
                value={employeeForm.is_active ? 1 : 0}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, is_active: Number(e.target.value) as EmployeeForm["is_active"] }))}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Cuti Terakhir (Dalam hari)</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Ex: 2'
                  required
                  value={employeeForm.cuti_terakhir}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, cuti_terakhir: Number(e.target.value) }))}
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Cuti Sekarang (Dalam hari)</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Ex: 2'
                  required
                  value={employeeForm.cuti_sekarang}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, cuti_sekarang: Number(e.target.value) }))}
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Tanggal Masuk</Form.Label>
              <Form.Control
                type='date'
                required
                value={employeeForm.tgl_masuk?.slice(0, 10)}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, tgl_masuk: e.target.value }))}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Tanggal Keluar</Form.Label>
              <Form.Control
                type='date'
                value={employeeForm.tgl_keluar?.slice(0, 10)}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, tgl_keluar: e.target.value }))}
              />
            </Form.Group>
          </Row>
          <Button type="submit" style={{ width: '100px' }} disabled={submitting}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default KaryawanEditForm