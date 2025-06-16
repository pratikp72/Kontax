import BackgroundFetch from 'react-native-background-fetch';

const BackgroundFetchHeadlessTask = async (event) => {
  console.log('[HeadlessTask] start:', event.taskId);

  try {
    const res = await fetch('https://your-api.com/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ headless: true }),
    });

    const data = await res.json();
    console.log('[HeadlessTask API Success]:', data);
  } catch (e) {
    console.error('[HeadlessTask API Error]:', e);
  }

  BackgroundFetch.finish(event.taskId);
};

export default BackgroundFetchHeadlessTask;
