import {create} from 'zustand'

interface Loading {
  isLoading: boolean;
  setLoading: (state: boolean) => void;
}

const useLoading = create<Loading>((set) => ({
  isLoading: false,
  setLoading: (state: boolean) => set({isLoading: state}),
}))

export default useLoading;