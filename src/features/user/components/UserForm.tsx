import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button, Form, Modal, Spinner, Stack } from 'react-bootstrap'
import { FormType, OpenEmployeeState } from '../types/UserTypes'
import { UserForm as UserFormType } from '@/modules/user/user.schema'
import { getUnaccountedEmployees } from '../UserAction'
import { roleSelect } from '@/lib/roleList'
import { toast } from 'react-toastify'

const UserForm = ({
  showModal,
  onModalClose,
  formType,
  userForm,
  setUserForm,
  passConfirm,
  setPassConfirm,
  onSubmit,
  isPosting,
  updatingId,
}: {
  showModal: boolean,
  onModalClose: () => void,
  formType: FormType,
  userForm: UserFormType,
  setUserForm: Dispatch<SetStateAction<UserFormType>>,
  passConfirm: string,
  setPassConfirm: Dispatch<SetStateAction<string>>,
  onSubmit: (payload: UserFormType) => void,
  isPosting: boolean,
  updatingId: string,
}) => {
  const [unaccountedEmployees, setUnaccountedEmpployees] = useState<OpenEmployeeState>({ isLoading: false, data: [] });

  useEffect(() => {
    if (showModal) {
      async function execute() {
        setUnaccountedEmpployees({ isLoading: true, data: [] });
        const employees = await getUnaccountedEmployees(updatingId);
        setUnaccountedEmpployees({ isLoading: false, data: employees.data ?? [] });
      }

      execute();
    }
  }, [showModal])

  const handleSubmit = (payload: UserFormType) => {
    if (payload.password !== passConfirm) return toast.error("password tidak sama");
    onSubmit(payload);
  }

  return (
    <Modal show={showModal} onHide={onModalClose}>
      <Modal.Header>
        <Modal.Title>{formType} User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(userForm)
      }}>
        <Modal.Body>
          <Stack gap={2}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                required
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.currentTarget.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                required={formType === "Tambah"}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.currentTarget.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                required={formType === "Tambah"}
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.currentTarget.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select
                required
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.currentTarget.value })}
              >
                <option value="">--Pilih Role--</option>
                {roleSelect.map(item =>
                  <option key={item.value} value={item.value}>{item.title}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Stack gap={2} direction='horizontal' style={{ marginBottom: "8px" }}>
                <Form.Label style={{ margin: "0px" }}>Karyawan</Form.Label>
                {unaccountedEmployees.isLoading && <Spinner animation="border" variant="secondary" size='sm' />}
              </Stack>
              <Form.Select
                required
                value={userForm.karyawan_id}
                onChange={(e) => setUserForm({ ...userForm, karyawan_id: e.currentTarget.value })}
                disabled={unaccountedEmployees.isLoading}
              >
                {unaccountedEmployees.isLoading && <option>Loading...</option>}
                <option value="">--Pilih Karyawan--</option>
                {unaccountedEmployees.data.map(item =>
                  <option key={item.id} value={item.id}>{item.nik} | {item.nama} | {item.jabatan}</option>
                )}
              </Form.Select>
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='danger' disabled={isPosting} onClick={onModalClose}>Batal</Button>
          <Button type='submit' variant='primary' disabled={isPosting}>{formType}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default UserForm