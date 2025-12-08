import { create } from "zustand";
type FeedBackStore = {
  message: string;
  type: string;
  setFeedbacks: (message: string, type: string) => void;
  clearFeedback: () => void;
};

export const useFeedBackStore = create<FeedBackStore>((set) => ({
  message: "",
  type: "",
  setFeedbacks: (message, type) => set(() => ({ message, type })),
  clearFeedback: () => set(() => ({ message: "", type: "" })),
}));
