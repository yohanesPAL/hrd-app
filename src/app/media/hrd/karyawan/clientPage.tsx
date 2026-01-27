"use client";
import ExportToExcel from '@/components/buttons/ExportToExcel'
import DefaultTable from '@/components/table/DefaulteTable'
import { exportTableToExcel } from '@/utils/exportTableToExcel'
import { ColumnDef, SortingState, Table } from '@tanstack/react-table'
import { FormEvent, useMemo, useState, useTransition } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation';
import { Button, Form, Modal, Stack, } from 'react-bootstrap';
import Link from 'next/link';
import useProfile from '@/stores/profile/ProfileStore';
import ConfirmDeleteModal from '@/components/confirmModal/ConfirmDeleteModal';

const defaultSort: SortingState = [{ id: 'urutan', desc: false }]
const kodeAbsenFormDefault = { id: "", kode_absensi: "" }
const confirmDeleteDefault = { show: false, nama: "", id: "" }

const ClientPage = ({ data }: { data: KaryawanTable[] }) => {
  const router = useRouter()
  const role = useProfile((state) => state.profile?.role)
  const [table, setTable] = useState<Table<KaryawanTable> | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [kodeAbsenForm, setKodeAbsenForm] = useState<PatchKodeAbsensi>(kodeAbsenFormDefault)
  const [namaOnEdit, setNamaOnEdit] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const [confirmDelete, setConfirmDelete] = useState(confirmDeleteDefault)

  const onCloseModal = () => {
    setShowModal(false)
    setNamaOnEdit("")
    setKodeAbsenForm(kodeAbsenFormDefault)
  }

  const updateKodeAbsen = async (payload: PatchKodeAbsensi) => {
    const res = await fetch(`/api/karyawan/${payload.id}/kode-absensi`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? "Request failed");
    }

    startTransition(() => {
      router.refresh();
    })
    onCloseModal();
    setIsPosting(false);
    return body;
  };

  const onUpdateKodeAbsen = (payload: PatchKodeAbsensi, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);

    toast.promise(
      updateKodeAbsen(payload), {
      pending: "Update kode absen...",
      success: "Berhasil update kode absen",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return 'Request failed'
        },
        autoClose: false,
      }
    }
    )
  }

  const deleteKaryawan = async (kode: string) => {
    const res = await fetch(`/api/karyawan`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(kode),
    })

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error ?? "Request failed");
    }

    setConfirmDelete(confirmDeleteDefault)
    setIsPosting(false);
    startTransition(() => {
      router.refresh();
    })
    return body;
  }

  const onDelete = (kode: string) => {
    setIsPosting(true);

    toast.promise(
      deleteKaryawan(kode), {
      pending: "Menghapus karyawan...",
      success: "Berhasil hapus karyawan",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return "Request failed"
        },
        autoClose: false,
      }
    }
    )
  }

  const columns = useMemo<ColumnDef<KaryawanTable>[]>(() => {
    return [
      { accessorKey: "urutan", header: "No", sortingFn: "alphanumeric" },
      {
        accessorKey: "nama", header: "Nama", cell: ({ row }) => {
          return (
            <Link href={`/media/${role}/profile/${row.original.id}`}>
              <Button type='button' variant='success' className='px-2 py-1'>{row.original.nama}</Button>
            </Link>
          )
        }
      },
      { accessorKey: "jk", header: "Jenis Kelaim" },
      { accessorKey: "alamat", header: "Alamat" },
      {
        accessorKey: "hp", header: "HP",
        meta: {
          print: (value: any) => value ? value : "-",
        }
      },
      { accessorKey: "jabatan", header: "Jabatan" },
      { accessorKey: "divisi", header: "Divisi" },
      {
        accessorKey: "status_aktif", header: "Status", cell: ({ getValue }) => {
          return getValue() as boolean ? "Aktif" : "Non Aktif"
        },
        meta: {
          print: (value: any) => value ? "Aktif" : "Non Aktif",
        }
      },
      { accessorKey: "status_karyawan", header: "Status Karyawan" },
      { accessorKey: "kode_absensi", header: "Kode Absen" },
      {
        id: "aksi", header: "Aksi", cell: ({ row }) => {
          const kode = row.original.id
          return (
            <Stack direction='horizontal' gap={2}>
              <Button type='button' onClick={() => {
                setNamaOnEdit(row.original.nama)
                setKodeAbsenForm({ id: kode, kode_absensi: row.original.kode_absensi })
                setShowModal(true);
              }}><i className="bi bi-fingerprint"></i></Button>
              <Button type='button' variant='success' onClick={() => router.push(`karyawan/${row.original.id}/edit`)}><i className="bi bi-pencil-fill"></i></Button>
              <Button type="button" variant='danger' onClick={() => setConfirmDelete({show: true, nama: row.original.nama, id: row.original.id})}><i className="bi bi-trash-fill"></i></Button>
            </Stack>
          )
        }
      }
    ]
  }, [])

  const onExport = () => {
    if (!table) return toast.error("Table tidak ditemukan");
    exportTableToExcel<KaryawanTable>(table, "Karyawan");
  }

  return (
    <>
      <Stack direction='horizontal' gap={2}>
        <Button type='button' variant='primary' onClick={() => router.push(`/media/${role}/karyawan/tambah`)}>
          <i className='bi bi-person-fill'></i>
          <span>Tambah</span>
        </Button>
        <ExportToExcel onExport={onExport} />
      </Stack>
      <DefaultTable<KaryawanTable>
        data={data ?? []}
        columns={columns}
        defaultSort={defaultSort}
        loading={isPending}
        tableWidth='110%'
        SetTableComponent={setTable}
      />

      <Modal show={showModal} onHide={onCloseModal}>
        <Modal.Header>
          <Modal.Title>Ubah Kode Absensi</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => onUpdateKodeAbsen(kodeAbsenForm, e)}>
          <Modal.Body>
            <Stack gap={2}>
              <Form.Group>
                <Form.Label>Nama</Form.Label>
                <Form.Control
                  type='text'
                  required
                  disabled
                  value={namaOnEdit}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Kode Absen</Form.Label>
                <Form.Control
                  type='text'
                  required
                  value={kodeAbsenForm.kode_absensi}
                  onChange={(e) => setKodeAbsenForm({ ...kodeAbsenForm, kode_absensi: e.currentTarget.value })}
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' variant='primary' disabled={isPosting && true}>Update</Button>
            <Button type='button' variant='danger' onClick={onCloseModal}>Batal</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmDeleteModal 
      props={confirmDelete} 
      setClose={() => setConfirmDelete(confirmDeleteDefault)} 
      onConfirm={(kode: string) => onDelete(kode)}
      isPosting={isPosting}
      />
    </>
  )
}

export default ClientPage