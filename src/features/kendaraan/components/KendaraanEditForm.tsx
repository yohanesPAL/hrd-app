'use client';
import { CAR_STATUS, CarForm } from '@/modules/car/car.schema'
import { DepoTable } from '@/modules/depo/depo.schema';
import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateCarAction } from '../mobilAction';
import { useRouter } from 'next/navigation';
import useProfile from '@/stores/profile/profile.store';
import { Nopol } from '../types/NopolTypes';
import { kodeNopol } from '../lib/kodeNopol';
import { useActionHandler } from '@/hooks/useActionHandler';

const KendaraanEditForm = ({
  id,
  data,
  depoOptions,
}: {
  id: string,
  data: CarForm,
  depoOptions: DepoTable[]
}) => {
  const router = useRouter();
  const role = useProfile((state) => state.profile?.role)
  const { run } = useActionHandler()

  const [form, setForm] = useState<CarForm>(data);
  const [nopol, setNopol] = useState<Nopol>(() => {
    const [prefix = "", id = "", sufix = ""] = data.nopol.split(" ");
    return { prefix, id, sufix };
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
    if (submitting || !id) return;
    if (!form) return toast.error("data tidak boleh kosong");
    if (form.jumlah_roda < 1) return toast.error("jumlah roda harus > 0")

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        nopol: `${nopol.prefix} ${nopol.id} ${nopol.sufix}`
      }

      await run(updateCarAction, [payload, id], {
        toast: {
          pending: "Update kendaraan...",
          success: "Berhasil update kendaraan",
          error: "Ooops... ada yang salah",
        },
        refresh: false
      })

      router.push(`/${role}/kendaraan`)
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h2 className='mb-4'>Form Kendaraan</h2>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit()
      }}>
        <Stack gap={4}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Mitsubishi Fuso'
                required
                value={form?.nama}
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
              <InputGroup>
                <Form.Select
                  required
                  value={nopol.prefix}
                  onChange={(e) => setNopol(prev => ({ ...prev, prefix: e.target.value.toUpperCase() }))}
                >
                  {
                    kodeNopol.map(item => (
                      <option key={item.kode} value={item.kode}>{item.kode}</option>
                    ))
                  }
                </Form.Select>
                <Form.Control
                  type='number'
                  placeholder='Ex: 1234'
                  required
                  value={nopol.id}
                  onChange={(e) => setNopol(prev => ({ ...prev, id: String(e.target.value) }))}
                />
                <Form.Control
                  type='text'
                  placeholder='Ex: KS'
                  required
                  value={nopol.sufix}
                  onChange={(e) => setNopol(prev => ({ ...prev, sufix: e.target.value.toUpperCase() }))}
                />
              </InputGroup>
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
                min={1901}
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

export default KendaraanEditForm