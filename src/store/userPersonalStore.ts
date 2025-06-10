import { create } from "zustand";



interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  designation: string;
  linkedln: string;
}

interface PersonalStore {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
}

export const usePersonalStore = create<PersonalStore>((set) => ({
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    linkedln: '',
  },
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
 
    })),
  resetForm: () =>
    set(() => ({
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        designation: '',
        linkedln: '',
      },
    })),
}));
