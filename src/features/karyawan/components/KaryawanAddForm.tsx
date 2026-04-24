'use client';
import { getTodayYYYYMMDD } from '@/utils/getToday';
import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap'
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { toast } from 'react-toastify';
import { KaryawanFormOptions } from '../types/KaryawanTypes';
import { BaseEmployee, EmployeeForm } from '@/modules/employee/employee.schema';
import { createKaryawanAction } from '../KaryawanAction';
import { useRouter } from 'next/navigation';
import useProfile from '@/stores/profile/profile.store';
import { EmployeeContractForm } from '@/modules/employee/contract/employee.contract.schema';
import { formatDateYYYYMMDD } from '@/utils/dateFormatting';
import { useActionHandler } from '@/hooks/useActionHandler';

const contractFormDefault: EmployeeContractForm = {
  tgl_kontrak: new Date(),
  tgl_berakhir: null,
  jenis: "kontrak",
  total_kontrak: 0,
  karyawan_id: "",
}

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
  const { run } = useActionHandler();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [employeeForm, setEmployeeForm] = useState<EmployeeForm>(defaulKaryawanForm)
  const [contractForm, setContractForm] = useState<EmployeeContractForm>(contractFormDefault)
  const profile = useProfile((state) => state.profile);

  const onSubmit = async () => {
    if (employeeForm.nik.length !== 16) return toast.error("NIK tidak sesuai")

    setSubmitting(true);

    try {
      await run(createKaryawanAction, [employeeForm, contractForm], {
        toast: {
          pending: "Membuat karyawan...",
          success: "Berhasil buat karywan",
          error: {
            render: ({ data: err }: { data: any }) => err?.message || "Ooops... ada yang salah",
          },
        }
      })

      router.push(`/${profile?.role}/karyawan`)
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
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, jk: e.target.value as BaseEmployee["jk"] }))}
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
                <option value={""}>--Pilih Divisi--</option>
                {formOptions?.activeDivision.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                required
                value={employeeForm.jabatan}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, jabatan: e.target.value }))}
              >
                <option value={""}>--Pilih Jabatan--</option>
                {formOptions?.activePosition.filter((item) => item.id_divisi === employeeForm.divisi).map((item) => (
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
                value={employeeForm.is_active ? 1 : 0}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, is_active: Number(e.target.value) as EmployeeForm["is_active"] }))}
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
                value={employeeForm.kode_absensi ?? ""}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, kode_absensi: e.target.value === "" ? null : e.target.value }))}
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
          <Form.Group>
            <Form.Label>Tanggal Masuk</Form.Label>
            <Form.Control
              type='date'
              required
              value={employeeForm.tgl_masuk}
              onChange={(e) => setEmployeeForm(prev => ({ ...prev, tgl_masuk: e.target.value }))}
            />
          </Form.Group>

          <h2 className='mb-0 mt-2'>Kontrak Form</h2>
          <Form.Group>
            <Form.Label>Jenis Kontrak</Form.Label>
            <Form.Select
              required
              value={contractForm.jenis}
              onChange={(e) => {
                if (e.target.value === "tetap") {
                  setContractForm(prev => ({ ...prev, tgl_berakhir: null }))
                } else {
                  setContractForm(prev => ({ ...prev, tgl_berakhir: new Date() }))
                }
                setContractForm(prev => ({ ...prev, jenis: e.target.value as EmployeeContractForm["jenis"] }))
              }}
            >
              <option value={"tetap"}>Tetap</option>
              <option value={"kontrak"}>Kontrak</option>
            </Form.Select>
          </Form.Group>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Tanggal Kontrak</Form.Label>
              <Form.Control
                type='date'
                required
                value={formatDateYYYYMMDD(contractForm.tgl_kontrak)}
                onChange={(e) => setContractForm(prev => ({ ...prev, tgl_kontrak: new Date(e.target.value) }))}
              />
            </Form.Group>
            {
              contractForm.jenis === "kontrak" && (
                <Form.Group as={Col}>
                  <Form.Label>Tanggal Berakhir</Form.Label>
                  <Form.Control
                    type='date'
                    required
                    value={contractForm.tgl_berakhir ? formatDateYYYYMMDD(contractForm.tgl_berakhir) : ""}
                    onChange={(e) => setContractForm(prev => ({ ...prev, tgl_berakhir: new Date(e.target.value) }))}
                  />
                </Form.Group>
              )
            }
          </Row>
          <Button type="submit" style={{ width: '100px' }} disabled={submitting}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default KaryawanForm