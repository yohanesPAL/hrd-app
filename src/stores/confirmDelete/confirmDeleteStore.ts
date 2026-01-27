import { create } from "zustand";

interface Props {
  nama: string;
  id: string;
  show?: boolean;
}

interface ConfirmDelete {
  props: Props;
  setOpen: (props: Props, onConfirm: (id: string) => void) => void;
  setClose: () => void;
  onConfirm?: (id: string) => void;
  isPosting: boolean;
}

const getDefaultProps = (): Props => ({
  nama: "",
  id: "",
  show: false,
});

const useConfirmDelete = create<ConfirmDelete>((set) => ({
  props: getDefaultProps(),
  setOpen: (props, onConfirm) => set({ props: { ...props, show: true }, onConfirm }),
  setClose: () => set({ props: getDefaultProps(), onConfirm: undefined }),
  onConfirm: undefined,
  isPosting: false,
}));

export default useConfirmDelete;
