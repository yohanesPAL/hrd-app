"use client";
import DefaultTable from '@/components/Table/DefaulteTable';
import { UserForm as UserFormType, UserId, UserTable } from '@/modules/user/user.schema';
import { SortingState } from '@tanstack/react-table';
import { UserColumns } from '../columns/UserColumns';
import ButtonWithIcon from '@/components/Buttons/ButtonWithIcon';
import { useState } from 'react';
import { createUser, deleteUser, updateUser } from '../UserAction';
import { FormType } from '../types/UserTypes';
import UserForm from './UserForm';
import { toast } from 'react-toastify';
import { useExecuteAction } from '@/hooks/useExecuteAction';
import useConfirmDelete from '@/stores/confirmDelete/confirmDelete.store';
import { useShallow } from 'zustand/shallow';

const defaulSort: SortingState = [{ id: "no", desc: false }];
const userFormDefault: UserFormType = {
  role: "",
  karyawan_id: "",
  username: "",
  password: "",
}

const UserPage = ({ users }: { users: UserTable[] }) => {
  const {
    setOpen: openConfirmDelete,
    isPosting
  } = useConfirmDelete(useShallow((state) => ({
    setOpen: state.setOpen,
    isPosting: state.isPosting
  })))

  const [formType, setFormType] = useState<FormType>("Tambah");
  const [userForm, setUserForm] = useState<UserFormType>(userFormDefault);
  const [passConfirm, setPassConfirm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string>("")
  const { executeAction, isSuspense } = useExecuteAction()

  const onModalClose = () => {
    setShowModal(false);
    setUserForm(userFormDefault);
    setPassConfirm("");
    setUpdatingId("");
  }

  const openFormModal = async () => {
    setShowModal(true);
  }

  const onSubmit = async (payload: UserFormType) => {
    if (!payload) return toast.error("data user tidak ditemukan");

    if (formType === "Tambah") {
      await toast.promise(
        executeAction(createUser, payload), {
        pending: "Membuat user...",
        success: "Berhasil buat user",
        error: "Ooops... ada yang salah",
      })
    } else if (formType ==="Update") {
      await toast.promise(
        executeAction(updateUser, updatingId, payload), {
        pending: "Update user...",
        success: "Berhasil update user",
        error: "Ooops... ada yang salah",
      })
    }

    onModalClose();
  }

  const onDelete = async (id: UserId) => {
    if (!id) return toast.error("id tidak boleh kosong");

    await toast.promise(
      executeAction(deleteUser, id), {
        pending: "Menghapus user...",
        success: "Berhasil hapus user",
        error: "Ooops... ada yang salah",
      }
    )
  }

  return (
    <>
      <ButtonWithIcon variant='success' iconClass='bi bi-person-fill' onClick={openFormModal}>Tambah</ButtonWithIcon>
      <DefaultTable<UserTable>
        data={users}
        defaultSort={defaulSort}
        columns={UserColumns({
          onDelete,
          openConfirmDelete,
          openFormModal,
          setUserForm,
          setFormType,
          setUpdatingId,
        })}
        loading={isSuspense}
      />

      <UserForm
        showModal={showModal}
        onModalClose={onModalClose}
        formType={formType}
        userForm={userForm}
        setUserForm={setUserForm}
        passConfirm={passConfirm}
        setPassConfirm={setPassConfirm}
        onSubmit={onSubmit}
        isPosting={isPosting}
        updatingId={updatingId}
      />
    </>
  )
}

export default UserPage