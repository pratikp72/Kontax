import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Platform,
  Text,
  SafeAreaView,
  Button,
  View,
  StyleSheet,
} from 'react-native';

import {
  request,
  PERMISSIONS,
  openSettings,
  RESULTS,
} from 'react-native-permissions'; // For camera permission
import {
  Commands,
  ReactNativeScannerView,
} from '@pushpendersingh/react-native-scanner';
import {useNavigation} from '@react-navigation/native';
import useScanStore from '../../store/useScanStore';

import {useScanDetails} from '../../services/useScanDetails';

const parseVCard = (vcard: string) => {
  const lines = vcard.split(/\r?\n/);
  const json: any = {};

  for (const line of lines) {
    if (line.startsWith('N:')) {
      const [, value] = line.split('N:');
      const [last, first] = value.split(';');
      json.name = {firstName: first, lastName: last};
    } else if (line.startsWith('TEL')) {
      const [, rest] = line.split(':');
      const typeMatch = line.match(/TYPE=([^:;]+)/);
      json.phone = {
        type: typeMatch ? typeMatch[1].split(',') : [],
        number: rest,
      };
    } else if (line.startsWith('EMAIL:')) {
      json.email = line.split('EMAIL:')[1];
    } else if (line.startsWith('ORG:')) {
      json.organization = line.split('ORG:')[1];
    } else if (line.startsWith('TITLE:')) {
      json.designation = line.split('TITLE:')[1];
    } else if (line.startsWith('URL:')) {
      let url = line.split('URL:')[1];
      if (!url.startsWith('http')) url = 'http://' + url;
      json.url = url;
    } else if (line.startsWith('X-EVENT-TITLE:')) {
      json.title = line.split('X-EVENT-TITLE:')[1];
    } else if (line.startsWith('X-EVENT-DATE:')) {
      json.date = line.split('X-EVENT-DATE:')[1];
    } else if (line.startsWith('X-EVENT-INTENT:')) {
      json.intent = line.split('X-EVENT-INTENT:')[1];
    } else if (line.startsWith('X-EVENT-LOCATION:')) {
      json.location = line.split('X-EVENT-LOCATION:')[1];
    }
  }

  return json;
};

export default function ScanQrScreen() {
  const scannerRef = useRef(null);
  const navigation = useNavigation();
  const {qrData, setQrData} = useScanStore();
  const {addScanDetail} = useScanDetails();
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
    useState(false);
  const [isActive, setIsActive] = useState(true);
  const [scannedData] = useState(null);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const handleBarcodeScanned = async event => {
    // const {data} = event?.nativeEvent;
    const data = event?.nativeEvent?.data ?? null;

    let parsedData = null;

    if (data.startsWith('BEGIN:VCARD')) {
      parsedData = parseVCard(data);
    } else {
      // First try JSON parsing
      try {
        parsedData = JSON.parse(data);
      } catch (jsonError) {
        // If not JSON, try to parse manually as query string
        const queryStart = data.indexOf('?');
        if (queryStart !== -1) {
          const queryString = data.substring(queryStart + 1);
          parsedData = parseQueryString(queryString);
        } else {
          console.warn(
            'Invalid QR content: Not a valid JSON or URL with query params:',
            data,
          );
          return;
        }
      }
    }

    console.log('Parsed QR Data:', parsedData);
    await setQrData(parsedData);
    console.log('data dtaaaaaaaaaaaaa', parsedData);

    addScanDetail({
      firstName: parsedData.name.firstName,
      lastName: parsedData.name.lastName,
      email: parsedData.email,
      phone: parsedData.phone,
      organization: parsedData.organization,
      designation: parsedData.designation,
      linkedln: parsedData.linkedln,
      title: parsedData.title,
      location: parsedData.location,
      intent: parsedData.intent,
      date: parsedData.date,
    });
    navigation.navigate('ContactDetailsForm');

    console.log('navigation success', qrData);
  };

  useEffect(() => {
    console.log('adding tabel.........');
  }, [addScanDetail]);
  const parseQueryString = queryString => {
    const params = {};
    const pairs = queryString.split('&');

    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    return {
      firstName: params.firstName || '',
      lastName: params.lastName || '',
      phone: params.phone || '',
      email: params.email || '',
      organization: params.organization || '',
      designation: params.designation || '',
      linkedln: params.linkedln || '',
      title: params.title || '',
      intent: params.intent || '',
      date: params.date || '',
      location: params.location || '',
    };
  };

  const resumeScanning = () => {
    if (scannerRef?.current) {
      Commands.resumeScanning(scannerRef?.current);
      console.log('Scanning resumed');
    }
  };

  const startScanning = () => {
    if (scannerRef?.current) {
      Commands.startCamera(scannerRef?.current);
    }
  };

  const checkCameraPermission = async () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    ).then(async (result: any) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          // console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          Alert.alert(
            'Permission Denied',
            'You need to grant camera permission first',
          );
          openSettings();
          break;
        case RESULTS.GRANTED:
          setIsCameraPermissionGranted(true);
          break;
        case RESULTS.BLOCKED:
          Alert.alert(
            'Permission Blocked',
            'You need to grant camera permission first',
          );
          openSettings();
          break;
      }
    });
  };

  if (isCameraPermissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        {isActive && (
          <ReactNativeScannerView
            ref={scannerRef}
            style={styles.scanner}
            onQrScanned={handleBarcodeScanned}
            pauseAfterCapture={true} // Pause the scanner after barcode / QR code is scanned
            isActive={isActive} // Start / stop the scanner using this prop
            showBox={true} // Show the box around the barcode / QR code
          />
        )}

        <View style={styles.controls}>
          <Button
            title="Resume Scanning"
            onPress={() => {
              resumeScanning();
              setIsActive(true);
            }}
          />

          <Button
            title="Start Camera"
            onPress={() => {
              startScanning();
            }}
          />
        </View>

        {scannedData && (
          <View style={styles.result}>
            <Text style={styles.resultText}>
              Scanned Data: {scannedData?.data}
            </Text>
            <Text style={styles.resultText}>Type: {scannedData?.type}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  } else {
    return (
      <Text style={styles.TextStyle}>
        You need to grant camera permission first
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'green',
    zIndex: 10,
  },
  scanner: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 10,
  },
  result: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    marginVertical: 4,
  },
  TextStyle: {
    fontSize: 25,
    color: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
