import { UserForm, UserId, UserTable } from "@/modules/user/user.schema";
import { ConfirmDeleteProps } from "@/stores/confirmDelete/confirmDelete.type";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Button, Stack } from "react-bootstrap";
import { FormType } from "../types/UserTypes";

export const UserColumns = ({
  onDelete,
  openConfirmDelete,
  openFormModal,
  setUserForm,
  setFormType,
  setUpdatingId,
}: {
  onDelete: (id: UserId) => void;
  openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void;
  openFormModal: () => void;
  setUserForm: Dispatch<SetStateAction<UserForm>>;
  setFormType: Dispatch<SetStateAction<FormType>>;
  setUpdatingId: Dispatch<SetStateAction<string>>;
}): ColumnDef<UserTable>[] => [
    { accessorKey: "no", header: "No", sortingFn: "alphanumeric" },
    { accessorKey: "username", header: "Username", },
    { accessorKey: "nama_karyawan", header: "Nama", },
    { accessorKey: "role", header: "Role", },
    {
      id: "aksi", header: "Aksi", cell: ({ row }) => {
        const id = row.original.id
        return (
          <Stack direction="horizontal" gap={2}>
            <Button type="button" variant="danger" onClick={() => openConfirmDelete({ nama: row.original.username, id: id }, (id: string) => onDelete(id))}><i className="bi bi-trash-fill"></i></Button>
            <Button type="button" variant="warning" onClick={() => {
              setUpdatingId(id);
              setUserForm({
                role: row.original.role,
                karyawan_id: row.original.karyawan_id,
                username: row.original.username,
                password: "",
              });
              setFormType("Update");
              openFormModal();
            }}><i className="bi bi-pencil-fill" style={{ color: "white" }}></i></Button>
          </Stack>
        )
      }
    }
  ]