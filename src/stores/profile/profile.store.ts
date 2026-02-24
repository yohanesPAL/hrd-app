import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { ProfileStore } from './profile.type';

const useProfile = create<ProfileStore>()(
  persist<ProfileStore>(
    (set: any) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null })
    }),
    {
      name: "user-profile"
    }
  )
)

export default useProfile;