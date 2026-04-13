import { create } from "zustand";

interface userState {
  name: string;
  setName: (name: string) => void;
  clearName: () => void;
  userName: string;
  setUserName: (userName: string) => void;
  clearUserName: () => void;
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
  description: string;
  setDescription: (description: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  birthday: string;
  setBirthday: (birthday: string) => void;
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  clearUserData: () => void;
}

export const useUserStore = create<userState>((set, get) => ({
  name: "",
  setName: (name) => set({ name: name }),
  clearName: () => set({ name: "" }),
  userName: "",
  setUserName: (name) => set({ userName: name }),
  clearUserName: () => set({ userName: "" }),
  email: "",
  setEmail: (email) => set({ email }),
  clearEmail: () => set({ email: "" }),
  description: "",
  setDescription: (description) => set({ description }),
  gender: "",
  setGender: (gender) => set({ gender }),
  birthday: "",
  setBirthday: (birthday) => set({ birthday }),
  city: "",
  setCity: (city) => set({ city }),
  country: "",
  setCountry: (country) => set({ country }),
  phone: "",
  setPhone: (phone) => set({ phone }),
  clearUserData: () => {
    const { clearName, clearUserName, clearEmail } = get();
    clearName();
    clearUserName();
    clearEmail();
    set({
      description: "",
      gender: "",
      birthday: "",
      city: "",
      country: "",
      phone: "",
    });
  },
}));
