"use client";
import DefaultTable from "@/components/Table/DefaulteTable";
import { useExecuteAction } from "@/hooks/useExecuteAction";
import { JamAbsenForm, JamAbsenTable } from "@/modules/master/jamAbsen/jamAbsen.schema";
import useConfirmDelete from "@/stores/confirmDelete/confirmDelete.store";
import { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";
import { jamAbsenColumns } from "../columns/JamAbsenColumns";
import JamAbsenFormModal from "./JamAbsenFormModal";
import { resetJamAbsenAction, updateJamAbsenAction } from "../jamAbsenAction";

const defaultSort: SortingState = [{ id: "no", desc: false }]
const defaultEditFormValue: JamAbsenForm = {
  id: "",
  nama_divisi: "",
  masuk: "",
  keluar: "",
  keluar_sabtu: "",
}

const JamAbsenPage = ({ data }: { data: JamAbsenTable[] }) => {
  const {
    isPosting,
  } = useConfirmDelete(
    useShallow((state) => ({
      isPosting: state.isPosting,
    }))
  )

  const [show, setShow] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<JamAbsenForm>(defaultEditFormValue)
  const { executeAction, isSuspense } = useExecuteAction();

  const onModalClose = () => {
    setShow(false);
    setEditForm(defaultEditFormValue);
  }

  const onSubmit = async(payload: JamAbsenForm) => {
    if (!payload) toast.error("data tidak boleh kosong");

    await toast.promise(
      executeAction(updateJamAbsenAction, payload), {
        pending: "Update jam absen...",
        success: "Berhasil update jam absen",
        error: "Ooops... ada yang salah",
      }
    )

    onModalClose();
  }

  const onReset = async(id: string) => {
    if (!id) toast.error("id tidak boleh kosong");
    
    await toast.promise(
      executeAction(resetJamAbsenAction, id), {
        pending: "Reset jam absen...",
        success: "Berhasil reset jam absen",
        error: "Ooops... ada yang salah",
      }
    )
  }

  return (
    <>
      <DefaultTable<JamAbsenTable>
        data={data}
        columns={jamAbsenColumns({
          setEditForm,
          setShow,
          onReset,
        })}
        defaultSort={defaultSort}
        loading={isSuspense}
      />

      <JamAbsenFormModal
        show={show}
        isPosting={isPosting}
        onModalClose={onModalClose}
        onSubmit={onSubmit}
        editForm={editForm}
        setEditForm={setEditForm}
      />
    </>
  )
}

export default JamAbsenPage