import React, {useEffect} from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import {openPrepopulatedDB} from './src/services/db';

const App = () => {
  useEffect(() => {
    openPrepopulatedDB();
  }, []);

  return <RootNavigator />;
};

export default App;
