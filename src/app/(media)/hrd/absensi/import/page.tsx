'use client';
import { importAbsenAction, truncateAbsenAction } from "@/features/absensi/AbsensiAction";
import { useActionHandler } from "@/hooks/useActionHandler";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";

const ImportPage = () => {
  const { openConfirmDelete } = useConfirmDelete()
  const { run } = useActionHandler();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit = async (formData: FormData) => {
    const file = formData.get("absen") as File;

    setSubmitting(true);

    try {
      await run(importAbsenAction, [file], {
        toast: {
          pending: "Import absen...",
          success: "Berhasil import absen",
          error: "Ooops... ada yang salah",
        }
      })
    } finally {
      setSubmitting(false);
    }
  }

  const onClear = async () => {
    setSubmitting(true);

    try {
      await run(truncateAbsenAction, [], {
        toast: {
          pending: "Menghapus absen...",
          success: "Berhasil hapus absen",
          error: "Ooops... ada yang salah",
        }
      })
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='page-container-border bg-white rounded p-2 pt-4'>
      <Stack direction="horizontal" gap={4} className="mb-4">
        <h4>Import Excel</h4>
        <Button type="button" variant="danger" disabled={submitting} onClick={() =>
          openConfirmDelete({ nama: "Data absen", id: "" }, () => onClear())}>
          <i className="bi bi-trash-fill"></i>
        </Button>
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
          <Button type="submit" style={{ width: "100px" }} disabled={submitting}>Submit</Button>
        </Stack>
      </Form>
    </div>
  )
}

export default ImportPage