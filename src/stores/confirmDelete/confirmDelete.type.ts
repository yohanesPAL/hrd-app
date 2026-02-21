export interface ConfirmDeleteProps {
  nama: string;
  id: string;
  show?: boolean;
}

export interface ConfirmDelete {
  props: ConfirmDeleteProps;
  setOpen: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void;
  setClose: () => void;
  isPosting: boolean;
  setIsPosting: (state: boolean) => void;
  onConfirm?: (id: string) => void;
}