import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PersonalDetailsFormScreen from '../screens/personalDetails/PersonalDetailsFormScreen';
import PersonalDataScreen from '../screens/pesonalData/PersonalDataScreen';
import CreateEventScreen from '../screens/createEvent/CreateEventScreen';
import QrCodeScreen from '../screens/qrCode/QrCodeScreen';
import ContactDetailsForm from '../screens/contactDetailsForm/ContactDetailsForm';


export type RootStackParamList = {
  PersonalDetailsForm: undefined;
  PersonalData:undefined;
  CreateEvent:undefined;
  QRCode:undefined;
  ContactDetailsForm:undefined;
 

};
const Stack = createNativeStackNavigator<RootStackParamList>();
const AppNavigator = () => {
  return (
  <Stack.Navigator initialRouteName="ContactDetailsForm">
        <Stack.Screen
      

          name="PersonalDetailsForm"
          component={PersonalDetailsFormScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
      

          name="PersonalData"
          component={PersonalDataScreen}
          options={{headerShown: false}}
        />


        <Stack.Screen
      

          name="CreateEvent"
          component={CreateEventScreen}
          options={{headerShown: false}}
        />


        
        <Stack.Screen
      

          name="QRCode"
          component={QrCodeScreen}
          options={{headerShown: false}}
        />



         <Stack.Screen
          name="ContactDetailsForm"
          component={ContactDetailsForm}
          options={{headerShown: false}}
        />
        </Stack.Navigator>


 
  )
}

export default AppNavigator