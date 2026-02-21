'use client';
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { FormEvent } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";

const ImportPage = () => {
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

  const postFile = async (formData: FormData) => {
    const res = await fetch('/api/absen/import', {
      method: 'POST',
      body: formData,
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error ?? "Request failed");
    }

    return body;
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    const formData = new FormData(e.currentTarget);
    toast.promise(
      postFile(formData).then((res) => console.log(res)).finally(() => setIsPosting(false)), {
      pending: "Mengupload file...",
      success: "File berhasil diupload",
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

  const truncateAbsen = async () => {
    const res = await fetch("/api/absen/import", { method: "DELETE" });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(body?.error ?? "Request failed");
    }

    return body;
  }

  const onClear = () => {
    setIsPosting(true)

    toast.promise(
      truncateAbsen().then(() => closeConfirmDelete()).finally(() => setIsPosting(false)), {
      pending: "Menghapus data absen...",
      success: "Berhasil hapus absen",
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

  return (
    <>
      <div>
        <Stack direction="horizontal" gap={4} className="mb-4">
          <h4>Import Excel</h4>
          <Button type="button" variant="danger" disabled={isPosting} onClick={() => openConfirmDelete({ nama: "Data absen", id: "" }, () => onClear())}><i className="bi bi-trash-fill"></i></Button>
        </Stack>
        <Form onSubmit={(e) => onSubmit(e)}>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Upload absensi (.xlsx)</Form.Label>
              <Form.Control type="file" name="absen" accept=".xlsx" required />
            </Form.Group>
            <Button type="submit" style={{ width: "100px" }} disabled={isPosting}>Submit</Button>
          </Stack>
        </Form>
      </div>
    </>
  )
}

export default ImportPage