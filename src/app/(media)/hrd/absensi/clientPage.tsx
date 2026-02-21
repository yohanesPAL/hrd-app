'use client';

import { Button, Stack } from "react-bootstrap";

const ClientPage = () => {
  return (
    <>
      <Button type="button" variant="success" onClick={() => console.log("slslsl")}>
        <Stack direction="horizontal" gap={2}>
          <span>Import</span>
          <i className="bi bi-file-earmark-arrow-up-fill"></i>
        </Stack>
      </Button>
    </>
  )
}

export default ClientPage