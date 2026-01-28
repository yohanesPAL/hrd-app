'use client';
import React, { FormEvent, useState } from 'react'
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useProfile from '@/stores/profile/ProfileStore';

const EditKaryawanForm = ({ karyawanData, depedencies }: { karyawanData: KaryawanEditForm, depedencies: KaryawanFormDepedencies }) => {
  const router = useRouter()
  const role = useProfile((state) => state.profile?.role)
  const [karyawanForm, setKaryawanForm] = useState<KaryawanEditForm>(karyawanData)
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const patchKaryawan = async (payload: KaryawanEditForm) => {
    const res = await fetch(`/api/karyawan/${karyawanForm.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? "request failed");
    }
    return body
  }

  const onSubmit = (payload: KaryawanEditForm, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!payload) return toast.error("data tidak ditemukan");
    if (!karyawanForm.id) return toast.error("id tidak ditemukan");
    setIsPosting(true)

    toast.promise(
      patchKaryawan(payload).then(() => router.push(`/media/${role}/karyawan`)), {
      pending: "Update karyawan...",
      success: "Berhasil update karyawan",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return 'Reqiest failed'
        },
        autoClose: false,
      }
    })
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
                onChange={(e) => setKaryawanForm({ ...karyawanForm, jk: e.currentTarget.value as KaryawanEditForm["jk"] })}
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
                onChange={(e) => setKaryawanForm({ ...karyawanForm, divisi: e.currentTarget.value, jabatan: "" })}
              >
                {depedencies.divisi.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                required
                value={karyawanForm.jabatan || ""}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, jabatan: e.currentTarget.value })}
              >
                <option value={""}>-- Pilih Jabatan --</option>
                {depedencies.jabatan.filter((item) => item.id_divisi === karyawanForm.divisi).map((item) => (
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
                value={karyawanForm.status_aktif ? 1 : 0}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, status_aktif: e.currentTarget.value === "1" })}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Status Karyawan</Form.Label>
              <Form.Select
                required
                value={karyawanForm.status_karyawan}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, status_karyawan: e.currentTarget.value })}
              >
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
                  onChange={(e) => setKaryawanForm({ ...karyawanForm, durasi_kontrak: Number(e.currentTarget.value) })}
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col}>
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
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Tanggal Masuk</Form.Label>
              <Form.Control
                type='date'
                required
                value={karyawanForm.tgl_masuk.slice(0, 10)}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, tgl_masuk: e.currentTarget.value })}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Tanggal Keluar</Form.Label>
              <Form.Control
                type='date'
                value={karyawanForm.tgl_keluar.slice(0, 10)}
                onChange={(e) => setKaryawanForm({ ...karyawanForm, tgl_keluar: e.currentTarget.value })}
              />
            </Form.Group>
          </Row>
          <Button type="submit" style={{ width: '100px' }} disabled={isPosting && true}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default EditKaryawanForm