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
import useConfirmDelete from '@/stores/confirmDelete/confirmDeleteStore';

const defaultSort: SortingState = [{ id: 'urutan', desc: false }]
const kodeAbsenFormDefault = { id: "", kode_absensi: "" }
const spFormDefault = { id: "", sp: 0 }

const ClientPage = ({ data }: { data: KaryawanTable[] }) => {
  const router = useRouter()
  const role = useProfile((state) => state.profile?.role)
  const openConfirmDelete = useConfirmDelete((state) => state.setOpen)
  const closeConfirmDelete = useConfirmDelete((state) => state.setClose)

  const [table, setTable] = useState<Table<KaryawanTable> | null>(null)
  const [showModalAbsen, setShowModalAbsen] = useState<boolean>(false)
  const [kodeAbsenForm, setKodeAbsenForm] = useState<PatchKodeAbsensi>(kodeAbsenFormDefault)
  const [showModalSp, setShowModalSp] = useState<boolean>(false)
  const [spForm, setSpForm] = useState<PatchSp>(spFormDefault)
  const [namaOnEdit, setNamaOnEdit] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const onCloseModalAbsen = () => {
    setShowModalAbsen(false)
    setNamaOnEdit("")
    setKodeAbsenForm(kodeAbsenFormDefault)
  }

  const onCloseModalSp = () => {
    setShowModalSp(false)
    setNamaOnEdit("")
    setSpForm(spFormDefault)
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
    onCloseModalAbsen();
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

  const updateSp = async (payload: PatchSp) => {
    const res = await fetch(`/api/karyawan/${payload.id}/sp`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false)
      throw new Error(body?.error ?? "Request failed");
    }

    startTransition(() => {
      router.refresh();
    })
    setIsPosting(false);
    onCloseModalSp();
    return body
  }

  const onUpdateSp = (payload: PatchSp, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payload) return toast.error("data tidak boleh kosong");
    if (payload.sp > 3) return toast.error("sp tidak boleh > 3");

    setIsPosting(true)
    
    toast.promise(
      updateSp(payload), {
      pending: "Update SP...",
      success: "Berhasil update SP",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message
          }
          return "Request failed"
        }
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

    closeConfirmDelete()
    setIsPosting(false);
    startTransition(() => {
      router.refresh();
    })
    return body;
  }

  const onDelete = (kode: string) => {
    if (!kode) return toast.error("id tidak boleh kosong!")

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
          const nama = row.original.nama
          return (
            <Stack direction='horizontal' gap={2}>
              <Button type='button' onClick={() => {
                setNamaOnEdit(nama)
                setKodeAbsenForm({ id: kode, kode_absensi: row.original.kode_absensi })
                setShowModalAbsen(true);
              }}><i className="bi bi-fingerprint"></i></Button>
              <Button type='button' variant='success' onClick={() => router.push(`karyawan/${kode}/edit`)}><i className="bi bi-pencil-fill"></i></Button>
              <Button type='button' variant='warning' className='text-white' onClick={() => {
                setNamaOnEdit(nama)
                setSpForm({ id: kode, sp: row.original.sp })
                setShowModalSp(true);
              }}>SP</Button>
              <Button type="button" variant='danger' onClick={() => openConfirmDelete({ nama: nama, id: kode }, (id) => onDelete(id))}><i className="bi bi-trash-fill"></i></Button>
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

      <Modal show={showModalAbsen} onHide={onCloseModalAbsen}>
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
            <Button type='button' variant='danger' onClick={onCloseModalAbsen}>Batal</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showModalSp} onHide={onCloseModalSp}>
        <Modal.Header>
          <Modal.Title>Ubah SP Karyawan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => onUpdateSp(spForm, e)}>
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
                <Form.Label>SP</Form.Label>
                <Form.Control
                  type='text'
                  required
                  value={spForm.sp}
                  onChange={(e) => setSpForm({ ...spForm, sp: Number(e.currentTarget.value) })}
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' variant='primary' disabled={isPosting && true}>Update</Button>
            <Button type='button' variant='danger' onClick={onCloseModalSp}>Batal</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ClientPage