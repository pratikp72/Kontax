import { useEffect } from 'react';
import BackgroundFetch from 'react-native-background-fetch';

const useBackgroundFetch = (onFetch) => {
  useEffect(() => {
    const init = async () => {
      const status = await BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // every 15 minutes
          stopOnTerminate: false,   // keep running after app is killed
          startOnBoot: true,        // auto-start on device boot
          enableHeadless: true,     // enable Android headless mode
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        },
        async (taskId) => {
          console.log('[BackgroundFetch] task received:', taskId);
          await onFetch(); // call your custom logic
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.warn('[BackgroundFetch] failed to start', error);
        }
      );

      console.log('[BackgroundFetch] configure status:', status);
    };

    init();
  }, [onFetch]);
};

export default useBackgroundFetch;
