import React, {useEffect} from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import {openPrepopulatedDB} from './src/services/db';
import useBackgroundFetch from './src/hooks/useBackgroundFetch';
import {uploadSQLiteDataToFirebase} from './src/services/syncService';
const App = () => {
  useEffect(() => {
    openPrepopulatedDB();
  }, []);
  useBackgroundFetch(async () => await uploadSQLiteDataToFirebase());

  return <RootNavigator />;
};

export default App;
