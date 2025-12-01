import { create } from "zustand";
type FeedBackStroe = {
  message: string;
  type: string;
  setFeedbacks: (message: string, type: string) => void;
  clearFeedback: () => void;
};

export const useFeedBackStore = create<FeedBackStroe>((set) => ({
  message: "",
  type: "",
  setFeedbacks: (message, type) => set(() => ({ message, type })),
  clearFeedback: () => set(() => ({ message: "", type: "" })),
}));
