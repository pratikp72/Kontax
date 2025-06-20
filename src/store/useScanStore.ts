import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

const useScanStore = create(
  persist(
    set => ({
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
        intent: '',
        date: '',
      },
      setQrData: data => set({qrData: data}),

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
            intent: '',
            date: '',
          },
        }),
    }),
    {
      name: 'qr-storage',
      storage: {
        getItem: async key => {
          const item = await AsyncStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async key => {
          await AsyncStorage.removeItem(key);
        },
      },
    },
  ),
);

export default useScanStore;
