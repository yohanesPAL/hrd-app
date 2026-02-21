"use client";
import DefaultTable from "@/components/Table/DefaulteTable";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { toast } from "react-toastify";

const parseClockToMinutes = (clock: string) => {
  const [hours, minutes] = clock.split(":").map(Number)
  return (hours * 60) + minutes
}

const defaultSort: SortingState = [{ id: "urutan", desc: false }]
const defaultEditFormValue: PatchAbsenDivisiForm = {
  id: "",
  masuk: "",
  keluar: "",
  keluar_sabtu: "",
}

const ClientPage = ({ data }: { data: AbsenDivisiTable[] }) => {
  const router = useRouter()
  const [show, setShow] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<PatchAbsenDivisiForm>(defaultEditFormValue)
  const [namaDivEdit, setNamaDivEdit] = useState<string>("")
  const [isPending, startTransition] = useTransition();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const onModalClose = () => {
    setShow(false);
    setEditForm(defaultEditFormValue);
    setNamaDivEdit("");
  }

  const patchAbsen = async (payload: any) => {
    const res = await fetch(`/api/absen/divisi/${payload.id}`, {
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

    return body
  }

  const onSubmit = (payload: PatchAbsenDivisiForm, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!payload) toast.error("data tidak boleh kosong");

    setIsPosting(true);
    const body = {
      id: payload.id,
      masuk: parseClockToMinutes(payload.masuk),
      keluar: parseClockToMinutes(payload.keluar),
      keluar_sabtu: parseClockToMinutes(payload.keluar_sabtu),
    }

    toast.promise(
      patchAbsen(body).then(() => {
        setIsPosting(false);
        onModalClose();
        startTransition(() => {
          router.refresh();
        })
      }), {
      pending: "Update jam absen...",
      success: "Berhasil update jam absen",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message;
          }
          return "Request failed";
        },
        autoClose: false,
      }
    }
    )
  }

  const resetAbsen = async (id: string) => {
    const res = await fetch(`/api/absen/divisi/${id}/reset`, { method: "PATCH" });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setIsPosting(false);
      throw new Error(body?.error ?? 'Request failed')
    }

    return body
  }

  const onReset = (id: string) => {
    if (!id) toast.error("id tidak boleh kosong");
    setIsPosting(true);

    toast.promise(
      resetAbsen(id).then(() => {
        setIsPosting(false);
        startTransition(() => {
          router.refresh();
        })
      }), {
      pending: "Reset jam absen...",
      success: "Berhasil reset jam absen",
      error: {
        render({ data }) {
          if (data instanceof Error) {
            return data.message;
          }
          return "Request failed";
        },
        autoClose: false,
      }
    }
    )
  }

  const columns = useMemo<ColumnDef<AbsenDivisiTable>[]>(() => {
    return [
      { accessorKey: "urutan", header: "No", sortingFn: "alphanumeric" },
      { accessorKey: "nama_divisi", header: "Divisi" },
      { accessorKey: "masuk", header: "Jam Masuk" },
      { accessorKey: "keluar", header: "Jam Keluar" },
      { accessorKey: "keluar_sabtu", header: "Jam Keluar (Sabtu)" },
      {
        id: "aksi", header: "Aksi", cell: ({ row }) => {

          return (
            <Stack direction="horizontal" gap={2}>
              <Button type="button" variant="success" onClick={() => {
                setNamaDivEdit(row.original.nama_divisi)
                setEditForm({
                  id: row.original.id,
                  masuk: row.original.masuk,
                  keluar: row.original.keluar,
                  keluar_sabtu: row.original.keluar_sabtu,
                });
                setShow(true);
              }}><i className="bi bi-pencil-fill"></i></Button>
              <Button type="button" variant="warning" onClick={() => { onReset(row.original.id) }}><i className="bi bi-arrow-counterclockwise"></i></Button>
            </Stack>
          )
        }
      },
    ]
  }, [])

  return (
    <>
      <DefaultTable<AbsenDivisiTable>
        data={data}
        columns={columns}
        defaultSort={defaultSort}
        loading={isPending}
      />

      <Modal show={show} onHide={onModalClose}>
        <Modal.Header>
          <Modal.Title>Ubah Jam Absen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => onSubmit(editForm, e)}>
          <Modal.Body>
            <Stack gap={2}>
              <Form.Group>
                <Form.Label>Divisi</Form.Label>
                <Form.Control
                  type="text"
                  value={namaDivEdit}
                  required
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Masuk</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.masuk}
                  onChange={(e) => setEditForm({ ...editForm, masuk: e.currentTarget.value })}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Keluar</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.keluar}
                  onChange={(e) => setEditForm({ ...editForm, keluar: e.currentTarget.value })}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Jam Keluar (Sabtu)</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.keluar_sabtu}
                  onChange={(e) => setEditForm({ ...editForm, keluar_sabtu: e.currentTarget.value })}
                  required
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="danger" onClick={onModalClose}>Batal</Button>
            <Button type="submit" variant="success" disabled={isPosting}>Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default ClientPage