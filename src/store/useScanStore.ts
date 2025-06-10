import { create } from 'zustand';

const useScanStore = create((set) => ({
  qrData: {
 firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    linkedln: '',
   
  },
  setQrData: (data) => set({ qrData: data }),

  clearQrData: () =>
    set({
      qrData: {
       firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    linkedln: '',
      },
    }),
}));

export default useScanStore;
