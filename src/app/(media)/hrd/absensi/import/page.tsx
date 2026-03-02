'use client';
import { importAbsen, truncateAbsen } from "@/features/absensi/AbsensiAction";
import { useExecuteAction } from "@/hooks/useExecuteAction";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { Button, Form, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";

const ImportPage = () => {
  const {
    setOpen: openConfirmDelete,
    isPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      setOpen: state.setOpen,
      isPosting: state.isPosting,
    }))
  )

  const { executeAction } = useExecuteAction();

  const onSubmit = async (formData: FormData) => {
    const file = formData.get("absen") as File;

    await toast.promise(
      executeAction(importAbsen, file), {
      pending: "Import absen...",
      success: "Berhasil import absen",
      error: "Ooops... ada yang salah",
    })
  }

  const onClear = async () => {
    await toast.promise(
      executeAction(truncateAbsen), {
      pending: "Menghapus absen...",
      success: "Berhasil hapus absen",
      error: "Ooops... ada yang salah",
    })
  }

  return (
    <div className='page-container-border bg-white rounded p-2 pt-4'>
      <Stack direction="horizontal" gap={4} className="mb-4">
        <h4>Import Excel</h4>
        <Button type="button" variant="danger" disabled={isPosting} onClick={() => openConfirmDelete({ nama: "Data absen", id: "" }, () => onClear())}><i className="bi bi-trash-fill"></i></Button>
      </Stack>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget))
      }}>
        <Stack gap={3}>
          <Form.Group>
            <Form.Label>Upload absensi (.xlsx)</Form.Label>
            <Form.Control type="file" name="absen" accept=".xlsx" required />
          </Form.Group>
          <Button type="submit" style={{ width: "100px" }} disabled={isPosting}>Submit</Button>
        </Stack>
      </Form>
    </div>
  )
}

export default ImportPage