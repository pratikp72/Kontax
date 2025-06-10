import { create } from 'zustand';

interface EventData {
  title: string;
  date: string;
  intent: string;
}

interface EventStore {
  eventData: EventData;
  setEventData: (data: Partial<EventData>) => void;
  resetEventData: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  eventData: {
    title: '',
    date: '',
    intent: '',
  },
  setEventData: (data) =>
    set((state) => ({
      eventData: { ...state.eventData, ...data },
    })),
  resetEventData: () =>
    set(() => ({
      eventData: {
        title: '',
        date: '',
        intent: '',
      },
    })),
}));
