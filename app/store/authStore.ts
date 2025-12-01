import { User } from "@/types/auth";
import { create } from "zustand";
type AuthStore = {
  users: User;
  setStoredUser: (user: User) => void;
};
export const useAuthStore = create<AuthStore>((set) => ({
  users: {
    id: "",
    name: "",
    email: "",
    createdAt: "",
  },
  setStoredUser: (user: User) => set(() => ({ users: user })),
}));
