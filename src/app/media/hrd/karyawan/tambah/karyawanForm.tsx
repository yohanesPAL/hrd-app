'use client';
import React from 'react'
import { Col, Form, Row, Stack } from 'react-bootstrap'

const KaryawanForm = () => {
  return (
    <Form>
      <Stack gap={4}>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>NIK</Form.Label>
            <Form.Control type='text' placeholder='Ex: 1812345678902049' required />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Nama</Form.Label>
            <Form.Control type='text' placeholder='Ex: Jhon Doe' required />
          </Form.Group>
        </Row>
        <Form.Group>
          <Form.Label>Alamat</Form.Label>
          <Form.Control type='text' placeholder='Ex: Jl. Soekarno Hatta No 100' required />
        </Form.Group>
        <Row>
          <Form.Group as={Col}>
            <Form.Label>Jenis Kelamin</Form.Label>
            <Form.Select required>
              <option value={"Pria"}>Pria</option>
              <option value={"Wanita"}>Wanita</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>HP</Form.Label>
            <Form.Control type='text' placeholder='Ex: 081234567890/+6281234567890' required />
          </Form.Group>
        </Row>
      </Stack>
    </Form>
  )
}

export default KaryawanForm