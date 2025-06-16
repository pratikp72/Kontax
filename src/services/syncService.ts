import SQLite from 'react-native-sqlite-storage';
import firestore from '@react-native-firebase/firestore'; // or realtime DB
import {Alert} from 'react-native';
import {openPrepopulatedDB} from './db';
import {useScanDetails} from './useScanDetails';
export const uploadSQLiteDataToFirebase = async () => {
  try {
    console.log('Fetching data from dummy json');

    const data = await fetch('https://dummyjson.com/test');

    const dataJson = await data.json();

    console.log('REsponse from api', dataJson);

    // Alert.alert('Fetched rows')
    const userId = 'some_user_id'; // dynamically get this if needed
    const collectionRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('syncedData');
    collectionRef.add({
      name: 'harsh patel',
      age: 30,
      uniqueId:Math.random()*2300
    });
    // for (const row of rows) {
    //   await collectionRef.add(row); // or set with unique ID
    // }

    console.log('[Sync] Upload successful. Synced rows:', userId);
  } catch (error) {
    console.log(error);
  }
};
