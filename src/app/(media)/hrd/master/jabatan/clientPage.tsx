'use client';
import DefaultTable from '@/components/Table/DefaulteTable';
import { ColumnDef, SortingState, Table } from '@tanstack/react-table';
import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react'
import { Button, Form, Modal, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ExportToExcel from '@/components/Buttons/ExportToExcel';
import { exportTableToExcel } from '@/utils/exportTableToExcel';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useShallow } from 'zustand/shallow';

const defaultSort: SortingState = [{ id: "urutan", desc: false }];
const defaultJabatanForm: JabatanForm = { id_divisi: "", nama: "", is_active: true };

const ClientPage = ({ data, divisiList }: { data: JabatanTable[], divisiList: DivisiInterface[] }) => {
  const router = useRouter();

  const {
    setOpen: openConfirmDelete,
    setClose: closeConfirmDelete,
    isPosting,
    setIsPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      setClose: state.setClose,
      isPosting: state.isPosting,
      setIsPosting: state.setIsPosting,
    }))
  )

  const [table, setTable] = useState<Table<JabatanTable> | null>(null);
  const [jabatanForm, setJabatanForm] = useState<JabatanForm>(defaultJabatanForm)
  const [editingId, setEditingId] = useState<string>("")
  const [show, setShow] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const onCloseModal = () => {
    setShow(false);
    setJabatanForm(defaultJabatanForm);
  }

  const postJabatan = async (payload: JabatanForm) => {
    const res = await fetch("/api/jabatan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error ?? 'Request failed');
    }

    return body
  }

  const patchJabatan = async (payload: JabatanInterface) => {
    const res = await fetch("/api/jabatan", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error ?? 'Request failed')
    }

    return body
  }

  const onSubmit = (payload: JabatanForm, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payload) return toast.error("data jabatan tidak boleh kosong");
    setIsPosting(true);

    if (editingId === "") {
      toast.promise(
        postJabatan(payload).then(() => {
          startTransition(() => {
            router.refresh();
          })
          onCloseModal();
        }).finally(() => setIsPosting(false)), {
        pending: "Menambah jabatan...",
        success: "Berhasil menambah jabatan!",
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
    } else {
      toast.promise(
        patchJabatan({ ...payload, id: editingId }).then(() => {
          setEditingId("");
          startTransition(() => {
            router.refresh();
          })
          onCloseModal();
        }).finally(() => setIsPosting(false)), {
        pending: "Update jabatan...",
        success: "Berhasil update jabatan!",
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
  }

  const deleteJabatan = async (kode: string) => {
    const res = await fetch('/api/jabatan', {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(kode)
    })

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error ?? 'Request failed')
    }

    return body
  }

  const onDelete = (kode: string) => {
    if (!kode) return toast.error("id tidak boleh kosong!");

    toast.promise(
      deleteJabatan(kode).then(() => {
        closeConfirmDelete();
        startTransition(() => {
          router.refresh();
        })
      }).finally(() => setIsPosting(false)), {
      pending: "Menghapus jabatan...",
      success: "Berhasil menghapus jabatan!",
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

  const columns = useMemo<ColumnDef<JabatanTable>[]>(() => {
    return [
      { accessorKey: "urutan", header: "No", sortingFn: 'alphanumeric' },
      { accessorKey: "nama", header: "Jabatan" },
      { accessorKey: "nama_divisi", header: "Divisi" },
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
                setJabatanForm({
                  id_divisi: row.original.id_divisi,
                  nama: row.original.nama,
                  is_active: row.original.is_active,
                });
                setShow(true);
                setEditingId(row.original.id);
              }}><i className="bi bi-pencil-fill"></i></Button>
              <Button type="button" variant='danger' onClick={() => openConfirmDelete({ nama: row.original.nama, id: kode }, (id) => { onDelete(id) })}><i className="bi bi-trash-fill"></i></Button>
            </Stack>
          )
        }
      },
    ]
  }, [])

  const onExport = () => {
    if (!table) {
      toast.error("Table tidak ditemukan");
      return;
    }
    exportTableToExcel<JabatanTable>(table, "Jabatan")
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => setShow(true)} disabled={divisiList.length > 0 && false}>
          <i className='bi bi-briefcase-fill'></i>
          <span>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>

      <DefaultTable<JabatanTable>
        loading={isPending}
        data={data ?? []}
        columns={columns}
        defaultSort={defaultSort}
        SetTableComponent={setTable}
      />

      <Modal show={show} onHide={onCloseModal}>
        <Form onSubmit={(e) => onSubmit(jabatanForm, e)}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Jabatan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <Form.Group>
                <Form.Label>Nama Jabatan</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Ex: Admin'
                  required
                  value={jabatanForm.nama}
                  onChange={(e) => setJabatanForm({ ...jabatanForm, nama: e.currentTarget.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  required
                  value={jabatanForm.is_active ? 1 : 0}
                  onChange={(e) => setJabatanForm({ ...jabatanForm, is_active: e.currentTarget.value === "1" })}
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Non Aktif</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Divisi</Form.Label>
                <Form.Select
                  required
                  value={jabatanForm.id_divisi}
                  onChange={(e) => setJabatanForm({ ...jabatanForm, id_divisi: e.currentTarget.value })}
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
            <Button type='button' variant='danger' onClick={onCloseModal}>Batal</Button>
            <Button type='submit' variant='primary' disabled={isPosting && true}>{editingId === "" ? "Submit" : "Update"}</Button>
          </Modal.Footer>
        </Form>
      </Modal >
    </>
  )
}

export default ClientPage