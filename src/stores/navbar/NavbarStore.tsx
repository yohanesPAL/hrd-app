import { create } from 'zustand'

interface Navbar {
  isShow: boolean,
  setShow: (isShow: boolean) => void
}

const useNavbar = create<Navbar>((set) => ({
  isShow: true,
  setShow: (state) => set({isShow: state})
})) 

export default useNavbar;