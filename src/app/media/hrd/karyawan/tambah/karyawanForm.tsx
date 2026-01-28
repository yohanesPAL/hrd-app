'use client';
import { getTodayYYYYMMDD } from '@/utils/getToday';
import { FormEvent, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap'
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useProfile from '@/stores/profile/ProfileStore';

const defaulKaryawanForm: KaryawanForm = {
  nik: "",
  nama: "",
  jk: "Pria",
  alamat: "",
  hp: "",
  divisi: "",
  jabatan: "",
  cuti_terakhir: 0,
  cuti_sekarang: 0,
  status_aktif: true,
  status_karyawan: "",
  durasi_kontrak: 0,
  kode_absensi: "",
  tgl_masuk: getTodayYYYYMMDD(),
}

const KaryawanForm = ({ depedencies }: { depedencies: KaryawanFormDepedencies | null }) => {
  const router = useRouter();
  const [karyawanForm, setKaryawanForm] = useState<KaryawanForm>(defaulKaryawanForm)
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const role = useProfile((state) => state.profile?.role)

  const postKaryawan = async (payload: KaryawanForm) => {
    const res = await fetch("/api/karyawan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? "request failed")
    }
    return body;
  }

  const onSubmit = (payload: KaryawanForm, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payload) return toast.error("data tidak boleh kosong");
    if (payload.nik.length !== 16) return toast.error("NIK tidak sesuai")
    if (payload.status_karyawan === "Kontrak" && payload.durasi_kontrak < 1) {
      return toast.error("Durasi karyawan kontrak tidak boleh kurang dari 1 hari")
    }

    setIsPosting(true);

    toast.promise(
      postKaryawan(payload).then(() => router.push(`/media/${role}/karyawan`)), {
      pending: "Menambah karyawan...",
      success: "Berhasil menambah karyawan!",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return 'Request failed'
        },
        autoClose: false,
      },
    }
    )
  }
  return (
    <>
      <h2 className='mb-4'>Form Karyawan</h2>
      <Form onSubmit={(e) => onSubmit(karyawanForm, e)}>
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
                onChange={(e) => setKaryawanForm({ ...karyawanForm, jk: e.currentTarget.value === "Pria" ? "Pria" : "Wanita" })}
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
                {depedencies?.divisi.map((item) => (
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
                {depedencies?.jabatan.filter((item) => item.id_divisi === karyawanForm.divisi).map((item) => (
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
                value={karyawanForm.status_aktif ? 1 : 0}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, status_aktif: e.currentTarget.value === "1" })}
              >
                <option value={"1"}>Aktif</option>
                <option value={"0"}>Non Aktif</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Status Karyawan</Form.Label>
              <Form.Select
                required
                value={karyawanForm.status_karyawan}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, status_karyawan: e.currentTarget.value })}
              >
                <option value={""}>--Status Karyawan--</option>
                <option value={"Kontrak"}>Kontrak</option>
                <option value={"Tetap"}>Tetap</option>
                <option value={"Resign"}>Resign</option>
                <option value={"Cutoff"}>Cutoff</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Durasi Kontrak (Dalam hari)</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Ex: 2'
                  required
                  value={karyawanForm.durasi_kontrak}
                  onChange={(e) => setKaryawanForm({ ...karyawanForm, durasi_kontrak: parseInt(e.currentTarget.value) })}
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Kode Absensi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 541'
                value={karyawanForm.kode_absensi}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, kode_absensi: e.currentTarget.value })}
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
                  onChange={(e) => setKaryawanForm({ ...karyawanForm, cuti_terakhir: parseInt(e.currentTarget.value) })}
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
                  onChange={(e) => setKaryawanForm({ ...karyawanForm, cuti_sekarang: parseInt(e.currentTarget.value) })}
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
          <Button type="submit" style={{ width: '100px' }} disabled={isPosting && false}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default KaryawanForm