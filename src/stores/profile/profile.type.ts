interface Profile {
  id: string;
  role: string;
}

export interface ProfileStore {
  profile: Profile | null;
  setProfile: (newProfile: Profile) => void;
  clearProfile: () => void;
}