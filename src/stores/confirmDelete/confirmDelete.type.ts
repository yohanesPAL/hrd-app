export interface ConfirmDeleteProps {
  nama: string;
  id: string;
  show?: boolean;
}

export interface ConfirmDelete {
  props: ConfirmDeleteProps;
  isSubmitting: boolean;
  setIsSubmitting: (state: boolean) => void,
  openConfirmDelete: (props: ConfirmDeleteProps, onConfirm: (id: string) => void) => void;
  closeConfirmDelete: () => void;
  onConfirm?: (id: string) => void;
  resetStore: () => void;
}