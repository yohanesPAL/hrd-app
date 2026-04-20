"use client"
import { useExecuteAction } from "@/hooks/useExecuteAction"
import { BaseCar, CAR_STATUS, CarForm } from "@/modules/car/car.schema"
import { DepoTable } from "@/modules/depo/depo.schema"
import { useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { toast } from "react-toastify"
import { createCarAction } from "../mobilAction"
import { useRouter } from "next/navigation"
import useProfile from "@/stores/profile/profile.store"

const defaulfForm: CarForm = {
  nama: "",
  jenis: "",
  merk: "",
  nopol: "",
  depo: "",
  tahun: "",
  jumlah_roda: 0,
  status: "baik" as BaseCar["status"],
}

const KendaraanForm = ({ depoOptions }: { depoOptions: DepoTable[] }) => {
  const router = useRouter();
  const role = useProfile((state) => state.profile?.role)

  const [form, setForm] = useState<CarForm>(defaulfForm);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { executeAction } = useExecuteAction();

  const onSubmit = async (kendaraan: CarForm) => {
    if (!kendaraan) return toast.error("data tidak boleh kosong");

    setSubmitting(true);

    await toast.promise(
      executeAction(createCarAction, kendaraan).catch((err) => {
        setSubmitting(false);
          
        throw err;
      }), {
      pending: "Membuat kendaraan...",
      success: "Berhasil buat kendaraan",
      error: {
        render: ({ data: err }: { data: any }) => err?.message || "Ooops... ada yang salah",
      },
    });

    router.push(`/${role}/kendaraan`)
  }

  return (
    <>
      <h2 className='mb-4'>Form Kendaraan</h2>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}>
        <Stack gap={4}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Mitsubishi Fuso'
                required
                value={form.nama}
                onChange={(e) => setForm(prev => ({ ...prev, nama: e.target.value }))}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Jenis</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Mobil Van'
                required
                value={form.jenis}
                onChange={(e) => setForm(prev => ({ ...prev, jenis: e.target.value }))}
              />
            </Form.Group>
          </Row>

          <Row >
            <Form.Group as={Col}>
              <Form.Label>No Polisi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: BE 1234 EB'
                required
                value={form.nopol}
                onChange={(e) => setForm(prev => ({ ...prev, nopol: e.target.value }))}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Merk</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Mitsubishi'
                required
                value={form.merk}
                onChange={(e) => setForm(prev => ({ ...prev, merk: e.target.value }))}
              />
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col}>
              <Form.Label>Depo</Form.Label>
              <Form.Select
                required
                value={form.depo}
                onChange={(e) => setForm(prev => ({ ...prev, depo: e.target.value }))}
              >
                <option value={""}>--Pilih Depo--</option>
                {
                  depoOptions.map(item => (
                    <option key={item.id} value={item.id}>{item.nama[0].toUpperCase() + item.nama.slice(1)}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Tahun</Form.Label>
              <Form.Control
                type='number'
                placeholder='YYYY'
                required
                value={form.tahun}
                onChange={(e) => setForm(prev => ({ ...prev, tahun: e.target.value }))}
                min={1900}
                max={2100}
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Jumlah Roda</Form.Label>
              <Form.Control
                type='number'
                placeholder='Ex: 4'
                required
                value={form.jumlah_roda}
                onChange={(e) => setForm(prev => ({ ...prev, jumlah_roda: Number(e.target.value) }))}
                min={0}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                required
                value={form.status}
                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
              >
                {
                  CAR_STATUS.map(status => (
                    <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
          </Row>
          <Button type="submit" style={{ width: "100px" }} disabled={submitting}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default KendaraanForm