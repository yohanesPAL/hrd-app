'use client';
import DefaultTable from '@/components/table/DefaulteTable';
import { ColumnDef, SortingState, Table } from '@tanstack/react-table';
import { FormEvent, useState } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const columns: ColumnDef<DivisiInterface>[] = [
  { accessorKey: "id", header: "Kode" },
  { accessorKey: "nama", header: "Nama Divisi" },
  {
    accessorKey: "is_active", header: "Status", cell: ({ getValue }) => {
      return getValue() as boolean ? "Aktif" : "Non Aktif"
    }
  },
  {
    id: "aksi", header: "Aksi", cell: ({ row }) => {
      const kode = row.original.id
      return (
        <Stack direction='horizontal' gap={2}>
          <Button type="button" variant='success' onClick={() => console.log('edit ' + kode)}><i className="bi bi-pencil"></i></Button>
          <Button type="button" variant='danger' onClick={() => console.log('hapus ' + kode)}><i className="bi bi-trash"></i></Button>
        </Stack>
      )
    }
  },
]

const defaultSort: SortingState = [{ id: "id", desc: false }]
const defaultDivisiForm: Divisi = { nama: "", is_active: true }

const ClientPage = ({ data, err }: { data: DivisiInterface[] | null, err: any }) => {
  const router = useRouter()
  const [table, setTable] = useState<Table<DivisiInterface> | null>(null);
  const [divisiForm, setDivisiForm] = useState<Divisi>(defaultDivisiForm)
  const [show, setShow] = useState<boolean>(false);

  const onCloseModal = () => {
    setShow(false);
    setDivisiForm(defaultDivisiForm)
  }

  const onSubmit = async(data: Divisi, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!data) return toast.error("data divisi tidak boleh kosong")

    try {
      const res = await fetch("/api/divisi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(divisiForm)
      })
      const body = await res.json().catch(() => null);

      if(!res.ok) {
        toast.error(body?.error ?? "Request failed");
      } else {
        toast.success("Berhasil menambahkan divisi");
        router.refresh();
        onCloseModal();
      }
    } catch (error: any) {
      toast.error(error);
    }
  }

  return (
    <>
      <Stack direction='horizontal'>
        <Button type='button' variant='primary' onClick={() => setShow(true)}>
          <i className='bi bi-stack'></i>
          <span>Tambah</span>
        </Button>
      </Stack>
      <DefaultTable<DivisiInterface>
        data={data ?? []}
        columns={columns}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />

      <Modal show={show} onHide={onCloseModal}>
        <Form onSubmit={(e) => onSubmit(divisiForm, e)}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Divisi</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Stack gap={3}>
            <Form.Group>
              <Form.Label>Nama Divisi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Admin'
                required
                onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.currentTarget.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                required
                onChange={(e) => setDivisiForm({ ...divisiForm, is_active: e.currentTarget.value === "1" })}
              >
                <option value={1}>Aktif</option>
                <option value={0}>Non Aktif</option>
              </Form.Select>
            </Form.Group>
            </Stack>
          </Modal.Body>

          <Modal.Footer>
            <Button type='button' variant='danger' onClick={onCloseModal}>Batal</Button>
            <Button type='submit' variant='primary'>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ClientPage