"use client";
import DefaultTable from "@/components/Table/DefaulteTable";
import { JamAbsenForm, JamAbsenTable } from "@/modules/master/jamAbsen/jamAbsen.schema";
import { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "react-toastify";
import { jamAbsenColumns } from "../columns/JamAbsenColumns";
import JamAbsenFormModal from "./JamAbsenFormModal";
import { resetJamAbsenAction, updateJamAbsenAction } from "../jamAbsenAction";
import { useActionHandler } from "@/hooks/useActionHandler";

const defaultSort: SortingState = [{ id: "no", desc: false }]
const defaultEditFormValue: JamAbsenForm = {
  id: "",
  nama_divisi: "",
  masuk: "",
  keluar: "",
  keluar_sabtu: "",
}

const JamAbsenPage = ({ data }: { data: JamAbsenTable[] }) => {
  const { run, isPending } = useActionHandler();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form, setForm] = useState<JamAbsenForm>(defaultEditFormValue)

  const onModalClosed = () => {
    setShowModal(false);
    setForm(defaultEditFormValue);
  }

  const onSubmit = async () => {
    await run(updateJamAbsenAction, [form], {
      toast: {
        pending: "Update jam absen...",
        success: "Berhasil update jam absen",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })

    onModalClosed()
  }

  const onReset = async (id: string) => {
    if (!id) toast.error("id tidak boleh kosong");

    await run(resetJamAbsenAction, [id], {
      toast: {
        pending: "Reset jam absen...",
        success: "Berhasil reset jam absen",
        error: "Ooops... ada yang salah",
      },
      refresh: true,
    })
  }

  return (
    <>
      <DefaultTable<JamAbsenTable>
        data={data}
        columns={jamAbsenColumns({
          setForm,
          setShowModal,
          onReset,
        })}
        defaultSort={defaultSort}
        loading={isPending}
      />

      <JamAbsenFormModal
        modal={{ show: showModal, onClosed: onModalClosed }}
        jamAbsen={{ onSubmit, form, setForm }}
        isPending={isPending}
      />
    </>
  )
}

export default JamAbsenPage