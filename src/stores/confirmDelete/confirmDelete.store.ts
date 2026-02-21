import { create } from "zustand";
import { ConfirmDelete, ConfirmDeleteProps } from "./confirmDelete.type";

const getDefaultProps = (): ConfirmDeleteProps => ({
  nama: "",
  id: "",
  show: false,
});

const useConfirmDelete = create<ConfirmDelete>((set) => ({
  props: getDefaultProps(),
  setOpen: (props, onConfirm) => set({ props: { ...props, show: true }, onConfirm }),
  setClose: () => set({ props: getDefaultProps(), onConfirm: undefined}),  
  isPosting: false,
  setIsPosting: (state: boolean) => set({isPosting: state}),
  onConfirm: undefined,
}));

export default useConfirmDelete;
