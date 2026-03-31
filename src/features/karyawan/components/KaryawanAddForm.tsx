'use client';
import { getTodayYYYYMMDD } from '@/utils/getToday';
import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap'
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { toast } from 'react-toastify';
import { KaryawanFormOptions } from '../types/KaryawanTypes';
import { BaseEmployee, EmployeeForm } from '@/modules/employee/employee.schema';
import { useExecuteAction } from '@/hooks/useExecuteAction';
import { createKaryawan } from '../KaryawanAction';
import { useRouter } from 'next/navigation';
import useProfile from '@/stores/profile/profile.store';

const defaulKaryawanForm: EmployeeForm = {
  nik: "",
  nama: "",
  jk: "Pria",
  alamat: "",
  hp: "",
  divisi: "",
  jabatan: "",
  cuti_terakhir: 0,
  cuti_sekarang: 0,
  is_active: 1,
  kode_absensi: null,
  tgl_masuk: getTodayYYYYMMDD(),
}

const KaryawanForm = ({ formOptions }: { formOptions: KaryawanFormOptions }) => {
  const router = useRouter();
  const [karyawanForm, setKaryawanForm] = useState<EmployeeForm>(defaulKaryawanForm)
  const { executeAction } = useExecuteAction()
  const profile = useProfile((state) => state.profile);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit = async (payload: EmployeeForm) => {
    if (!payload) return toast.error("data tidak boleh kosong");
    if (payload.nik.length !== 16) return toast.error("NIK tidak sesuai")

    setSubmitted(true);

    await toast.promise(
      executeAction(createKaryawan, payload).catch((err) => {
        setSubmitted(false);
        throw err;
      }), {
      pending: "Membuat karyawan...",
      success: "Berhasil buat karywan",
      error: "Ooops... ada yang salah",
    })

    router.push(`/${profile?.role}/karyawan`)
  }
  return (
    <>
      <h2 className='mb-4'>Form Karyawan</h2>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(karyawanForm);
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
                value={karyawanForm.nik}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, nik: e.currentTarget.value })}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Jhon Doe'
                required
                value={karyawanForm.nama}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, nama: e.currentTarget.value })}
              />
            </Form.Group>
          </Row>
          <Form.Group>
            <Form.Label>Alamat</Form.Label>
            <Form.Control
              type='text'
              placeholder='Ex: Jl. Soekarno Hatta No 100'
              required
              value={karyawanForm.alamat}
              onChange={(e) => setKaryawanForm({ ...karyawanForm, alamat: e.currentTarget.value })}
            />
          </Form.Group>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select
                required
                value={karyawanForm.jk}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, jk: e.currentTarget.value as BaseEmployee["jk"] })}
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
                value={karyawanForm.hp}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, hp: e.currentTarget.value })}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Divisi</Form.Label>
              <Form.Select
                required
                value={karyawanForm.divisi}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, divisi: e.currentTarget.value })}
              >
                <option value={""}>--Pilih Divisi--</option>
                {formOptions?.division.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                required
                value={karyawanForm.jabatan}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, jabatan: e.currentTarget.value })}
              >
                <option value={""}>--Pilih Jabatan--</option>
                {formOptions?.position.filter((item) => item.id_divisi === karyawanForm.divisi).map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))
                }
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Status Aktif</Form.Label>
              <Form.Select
                required
                value={karyawanForm.is_active ? 1 : 0}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, is_active: Number(e.currentTarget.value) as EmployeeForm["is_active"] })}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Kode Absensi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 541'
                value={karyawanForm.kode_absensi ?? ""}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, kode_absensi: e.currentTarget.value === "" ? null : e.currentTarget.value })}
              />
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
                  value={karyawanForm.cuti_terakhir}
                  onChange={(e) => setKaryawanForm({ ...karyawanForm, cuti_terakhir: Number(e.currentTarget.value) })}
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
                  value={karyawanForm.cuti_sekarang}
                  onChange={(e) => setKaryawanForm({ ...karyawanForm, cuti_sekarang: Number(e.currentTarget.value) })}
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>
          </Row>
          <Form.Group>
            <Form.Label>Tanggal Masuk</Form.Label>
            <Form.Control
              type='date'
              required
              value={karyawanForm.tgl_masuk}
              onChange={(e) => setKaryawanForm({ ...karyawanForm, tgl_masuk: e.currentTarget.value })}
            />
          </Form.Group>
          <Button type="submit" style={{ width: '100px' }} disabled={submitted}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default KaryawanForm