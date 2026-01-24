'use client';
import DefaultTable from '@/components/table/DefaulteTable';
import { ColumnDef, SortingState, Table } from '@tanstack/react-table';
import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ExportToExcel from '@/components/buttons/ExportToExcel';
import { exportTableToExcel } from '@/utils/exportTableToExcel';

const defaultSort: SortingState = [{ id: "urutan", desc: false }]
const defaultDivisiForm: Divisi = { nama: "", is_active: true }

const ClientPage = ({ data, err }: { data: DivisiTable[] | null, err: any }) => {
  useEffect(() => { toast.error(err) }, [err])

  const router = useRouter()
  const [table, setTable] = useState<Table<DivisiTable> | null>(null);
  const [divisiForm, setDivisiForm] = useState<Divisi>(defaultDivisiForm)
  const [editingId, setEditingId] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition()

  const onCloseModal = () => {
    setShow(false);
    setDivisiForm(defaultDivisiForm)
    setEditingId("");
  }

  const postDivisi = async (payload: Divisi) => {
    const res = await fetch("/api/divisi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? 'Request failed')
    }

    setIsPosting(false);
    startTransition(() => {
      router.refresh();
    })
    onCloseModal();
    return body
  }

  const updateDivisi = async (payload: DivisiInterface) => {
    const res = await fetch("/api/divisi", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? 'Request failed')
    }

    setIsPosting(false);
    startTransition(() => {
      router.refresh();
    })
    onCloseModal();
    setEditingId("");
    return body
  }

  const onSubmit = (payload: Divisi, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payload) return toast.error("data divisi tidak boleh kosong")
    setIsPosting(true);

    if (editingId === "") {
      toast.promise(
        postDivisi(payload), {
        pending: "Menambah divisi...",
        success: "Berhasil menambah divisi!",
        error: {
          render({ data }) {
            if (data instanceof Error) {
              return data.message
            }
            return 'Request failed'
          },
          autoClose: false,
        },
      },
      )
    } else {
      toast.promise(
        updateDivisi({ ...payload, id: editingId }), {
        pending: "Update divisi...",
        success: "Berhasil update divisi!",
        error: {
          render({ data }) {
            if (data instanceof Error) {
              return data.message
            }
            return 'Request failed'
          },
          autoClose: false,
        },
      },
      )
    }
  }

  const deleteDivisi = async (kode: string) => {
    const res = await fetch(`/api/divisi`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(kode)
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? 'Request failed')
    }

    setIsPosting(false);
    startTransition(() => {
      router.refresh();
    })
    return body
  }

  const onDelete = (kode: string) => {
    toast.promise(
      deleteDivisi(kode), {
      pending: "Menghapus divisi...",
      success: "Berhasil menghapus divisi!",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return 'Request failed'
        },
        autoClose: false,
      },
    })
  }

  const columns = useMemo<ColumnDef<DivisiTable>[]>(() => {
    return [
      { accessorKey: "urutan", header: "No", sortingFn: "alphanumeric" },
      { accessorKey: "nama", header: "Nama Divisi" },
      {
        accessorKey: "is_active", header: "Status", cell: ({ getValue }) => {
          return getValue() as boolean ? "Aktif" : "Non Aktif"
        },
        meta: {
          print: (value: boolean) => value ? "Aktif" : "Non Aktif"
        }
      },
      {
        id: "aksi", header: "Aksi", cell: ({ row }) => {
          const kode = row.original.id
          return (
            <Stack direction='horizontal' gap={2}>
              <Button type="button" variant='success' onClick={() => {
                setEditingId(kode);
                setDivisiForm({ nama: row.original.nama, is_active: row.original.is_active });
                setShow(true);
              }}><i className="bi bi-pencil-fill"></i></Button>
              <Button type="button" variant='danger' onClick={() => onDelete(kode)}><i className="bi bi-trash-fill"></i></Button>
            </Stack>
          )
        }
      },
    ]
  }, [])

  const onExport = () => {
    if(!table) {
      toast.error("Table tidak ditemukan");
      return
    }
    exportTableToExcel<DivisiTable>(table, "Divisi")
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => setShow(true)}>
          <i className='bi bi-stack'></i>
          <span>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport}/>
      </Stack>
      <DefaultTable<DivisiTable>
        data={data ?? []}
        columns={columns}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
        loading={isPending}
      />

      <Modal show={show} onHide={onCloseModal}>
        <Form onSubmit={(e) => onSubmit(divisiForm, e)}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId === "" ? "Tambah" : "Update"} Divisi</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label>Nama Divisi</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ex: Admin'
                  required
                  value={divisiForm.nama}
                  onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.currentTarget.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={divisiForm.is_active ? 1 : 0}
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
            <Button type='submit' variant='primary' disabled={isPosting && true}>{editingId === "" ? "Submit" : "Update"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ClientPage