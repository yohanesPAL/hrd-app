'use client';
import React from 'react'
import { Button, Col, Form, InputGroup, Row, Stack } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';

const EditKaryawanForm = ({ karyawanId }: { karyawanId: string }) => {
  return (
    <>
      <h2 className='mb-4'>Form Karyawan</h2>
      <Form>
        <Stack gap={4}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>NIK</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 1812345678902049'
                maxLength={16}
                required
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: Jhon Doe'
                required
              />
            </Form.Group>
          </Row>
          <Form.Group>
            <Form.Label>Alamat</Form.Label>
            <Form.Control
              type='text'
              placeholder='Ex: Jl. Soekarno Hatta No 100'
              required
            />
          </Form.Group>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select
                required
              >
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>HP</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 081234567890/+6281234567890'
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Divisi</Form.Label>
              <Form.Select
                required
              >

              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Jabatan</Form.Label>
              <Form.Select
                required
              >

              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Status Aktif</Form.Label>
              <Form.Select
                required
              >
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Status Karyawan</Form.Label>
              <Form.Select
                required
              >
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Durasi Kontrak (Dalam hari)</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Ex: 2'
                  required
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Kode Absensi</Form.Label>
              <Form.Control
                type='text'
                placeholder='Ex: 541'
              />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Cuti Terakhir (Dalam hari)</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Ex: 2'
                  required
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Cuti Sekarang (Dalam hari)</Form.Label>
              <InputGroup>
                <Form.Control
                  type='number'
                  placeholder='Ex: 2'
                  required
                />
                <InputGroupText>Hari</InputGroupText>
              </InputGroup>
            </Form.Group>
          </Row>
          <Form.Group>
            <Form.Label>Tanggal Masuk</Form.Label>
            <Form.Control
              type='date'
              required
            />
          </Form.Group>
          <Button type="submit" style={{ width: '100px' }}>Submit</Button>
        </Stack>
      </Form>
    </>
  )
}

export default EditKaryawanForm