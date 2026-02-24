import { create } from 'zustand'
import { Navbar } from './navbar.type';

const useNavbar = create<Navbar>((set) => ({
  isShow: true,
  setShow: (state) => set({isShow: state})
})) 

export default useNavbar;