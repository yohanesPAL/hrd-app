import { create } from 'zustand'
import { persist } from 'zustand/middleware';

interface Profile {
  role: string;
}

interface ProfileStore {
  profile: Profile | null;
  setProfile: (newProfile: Profile) => void;
  clearProfile: () => void;
}

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