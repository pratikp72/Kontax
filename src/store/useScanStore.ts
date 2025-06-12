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
    title: '',
    location: '',
    intent:"",
    date:""

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
   
    title: '',
    location: '',
    intent:"",
    date:""

  },
    }),
}));

export default useScanStore;
