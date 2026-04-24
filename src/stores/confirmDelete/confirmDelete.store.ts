import { create } from "zustand";
import { ConfirmDelete, ConfirmDeleteProps } from "./confirmDelete.type";

const getDefaultProps = (): ConfirmDeleteProps => ({
  nama: "",
  id: "",
  show: false,
});

const useConfirmDelete = create<ConfirmDelete>((set) => ({
  props: getDefaultProps(),
  isSubmitting: false,
  setIsSubmitting: (state: boolean) => set({isSubmitting: state}),
  openConfirmDelete: (props, onConfirm) => set({ props: { ...props, show: true }, onConfirm }),
  closeConfirmDelete: () => set({ props: getDefaultProps(), onConfirm: undefined}),  
  onConfirm: undefined,
  resetStore: () => set({props: getDefaultProps()}),
}));

export default useConfirmDelete;
