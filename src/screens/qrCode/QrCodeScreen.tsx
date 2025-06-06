


// import React, { useRef, useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Animated,
//   Dimensions,
//   Alert,
//   StatusBar,
//   Share,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Clipboard from '@react-native-clipboard/clipboard';
// import RNShare from 'react-native-share';
// import RNFS from 'react-native-fs';
// import { CameraRoll } from '@react-native-camera-roll/camera-roll';

// const { width, height } = Dimensions.get('window');

// interface UserDetails {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   dateOfBirth: string;
// }

// interface EventDetails {
//   title: string;
//   date: string;
//   intent: string;
// }

// interface QRData {
//   user: UserDetails;
//   event: EventDetails;
//   generatedAt: string;
//   qrId: string;
// }

// // Sample data - in real app, this would come from props/navigation params
// const sampleUserData: UserDetails = {
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john.doe@example.com',
//   phone: '+1 (555) 123-4567',
//   address: '123 Main Street',
//   city: 'New York',
//   zipCode: '10001',
//   dateOfBirth: '01/15/1990',
// };

// const sampleEventData: EventDetails = {
//   title: 'Tech Networking Meetup',
//   date: '12/25/2024',
//   intent: 'Networking',
// };

// const QrCodeScreen: React.FC = () => {
//   const [qrData, setQrData] = useState<QRData | null>(null);
//   const [showDetails, setShowDetails] = useState<boolean>(false);
//   const [qrRef, setQrRef] = useState<any>(null);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
//   const qrScaleAnim = useRef(new Animated.Value(0.8)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     // Generate QR data
//     const qrDataObject: QRData = {
//       user: sampleUserData,
//       event: sampleEventData,
//       generatedAt: new Date().toISOString(),
//       qrId: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//     };
//     setQrData(qrDataObject);

//     // Animate entrance
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.spring(qrScaleAnim, {
//         toValue: 1,
//         tension: 100,
//         friction: 8,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Start pulse animation
//     startPulseAnimation();
//   }, []);

//   const startPulseAnimation = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1500,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   // Request storage permission for Android
//   const requestStoragePermission = async (): Promise<boolean> => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to storage to download QR code',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleShareQR = async () => {
//     if (!qrData || !qrRef) {
//       Alert.alert('Error', 'QR code not ready for sharing');
//       return;
//     }

//     setIsProcessing(true);
    
//     try {
//       // Get QR code as SVG/Data URL
//       qrRef.toDataURL((dataURL: string) => {
//         const qrString = JSON.stringify(qrData, null, 2);
//         const eventTitle = qrData.event.title;
//         const eventDate = qrData.event.date;
//         const organizerName = `${qrData.user.firstName} ${qrData.user.lastName}`;

//         // Create comprehensive share message
//         const shareMessage = `🎉 Event QR Code - ${eventTitle}

// 📅 Date: ${eventDate}
// 👤 Organizer: ${organizerName}
// 🎯 Purpose: ${qrData.event.intent}

// 📱 Scan the QR code to get complete event details!

// Complete Data:
// ${qrString}`;

//         // Share using React Native Share with both text and QR image
//         const shareOptions = {
//           title: `Event QR Code - ${eventTitle}`,
//           message: shareMessage,
//           url: dataURL, // QR code image data URL
//           subject: `Invitation: ${eventTitle}`, // For email sharing
//           type: 'image/png',
//         };

//         RNShare.open(shareOptions)
//           .then((res) => {
//             console.log('Share result:', res);
//             setIsProcessing(false);
//           })
//           .catch((err) => {
//             console.log('Share error:', err);
//             // Fallback to native Share API
//             fallbackShare(shareMessage);
//           });
//       });
//     } catch (error) {
//       console.error('Error sharing QR code:', error);
//       const qrString = JSON.stringify(qrData, null, 2);
//       fallbackShare(`Event QR Code Data:\n\n${qrString}`);
//     }
//   };

//   const fallbackShare = async (message: string) => {
//     try {
//       await Share.share({
//         message,
//         title: 'Event QR Code',
//       });
//       setIsProcessing(false);
//     } catch (error) {
//       console.error('Fallback share error:', error);
//       Alert.alert('Error', 'Failed to share QR code');
//       setIsProcessing(false);
//     }
//   };

//   const handleCopyData = async () => {
//     if (!qrData) {
//       Alert.alert('Error', 'No data to copy');
//       return;
//     }

//     try {
//       const qrString = JSON.stringify(qrData, null, 2);
//       await Clipboard.setString(qrString);
      
//       Alert.alert(
//         'Copied! ✅',
//         'QR code data has been copied to clipboard',
//         [{ text: 'OK', style: 'default' }]
//       );
//     } catch (error) {
//       console.error('Copy error:', error);
//       Alert.alert('Error', 'Failed to copy data to clipboard');
//     }
//   };

//   const handleDownloadQR = async () => {
//     if (!qrData || !qrRef) {
//       Alert.alert('Error', 'QR code not ready for download');
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Request storage permission
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Storage permission is required to download QR code');
//         setIsProcessing(false);
//         return;
//       }

//       // Get QR code as data URL
//       qrRef.toDataURL(async (dataURL: string) => {
//         try {
//           // Create filename
//           const fileName = `qr-code-${qrData.event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.png`;
          
//           // Define file path
//           const downloadDir = Platform.OS === 'ios' 
//             ? RNFS.DocumentDirectoryPath 
//             : RNFS.DownloadDirectoryPath;
          
//           const filePath = `${downloadDir}/${fileName}`;

//           // Convert data URL to base64
//           const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

//           // Write file
//           await RNFS.writeFile(filePath, base64Data, 'base64');

//           // Save to camera roll (photo gallery)
//           if (Platform.OS === 'ios') {
//             await CameraRoll.save(filePath, { type: 'photo' });
//           } else {
//             // For Android, the file is already in Downloads folder
//             // Optionally save to gallery as well
//             try {
//               await CameraRoll.save(filePath, { type: 'photo' });
//             } catch (galleryError) {
//               console.log('Gallery save failed, but file saved to Downloads');
//             }
//           }

//           setIsProcessing(false);
          
//           Alert.alert(
//             'Download Successful! ✅',
//             `QR code saved as:\n${fileName}\n\nLocation: ${Platform.OS === 'ios' ? 'Photos' : 'Downloads folder & Gallery'}`,
//             [
//               { text: 'OK', style: 'default' },
//               { 
//                 text: 'Open File', 
//                 style: 'default',
//                 onPress: () => {
//                   // Optionally open file or show in file manager
//                   console.log('File saved at:', filePath);
//                 }
//               }
//             ]
//           );

//         } catch (fileError) {
//           console.error('File save error:', fileError);
//           setIsProcessing(false);
//           Alert.alert('Error', 'Failed to save QR code to device');
//         }
//       });

//     } catch (error) {
//       console.error('Download error:', error);
//       setIsProcessing(false);
//       Alert.alert('Error', 'Failed to download QR code');
//     }
//   };

//   const toggleDetails = () => {
//     setShowDetails(!showDetails);
//   };

//   if (!qrData) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <Text style={styles.loadingText}>Generating QR Code...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Create QR code data string
//   const qrCodeValue = JSON.stringify(qrData);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#27AE60" />
      
//       {/* Header */}
//       <View style={styles.header}>
//         <Animated.View
//           style={[
//             styles.headerContent,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateY: slideAnim }],
//             },
//           ]}
//         >
//           <TouchableOpacity style={styles.backButton}>
//             <Text style={styles.backButtonText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Event QR Code</Text>
//           <Text style={styles.headerSubtitle}>Share your event details instantly</Text>
//         </Animated.View>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* QR Code Container */}
//         <Animated.View
//           style={[
//             styles.qrContainer,
//             {
//               opacity: fadeAnim,
//               transform: [
//                 { scale: qrScaleAnim },
//                 { scale: pulseAnim }
//               ],
//             },
//           ]}
//         >
//           <View style={styles.qrCodeWrapper}>
//             <QRCode
//               value={qrCodeValue}
//               size={200}
//               ref={(ref) => setQrRef(ref)}
//               backgroundColor="white"
//               color="black"
//             />
//           </View>
//           <Text style={styles.qrLabel}>Scan to view details</Text>
//         </Animated.View>

//         {/* Event Summary */}
//         <View style={styles.summaryContainer}>
//           <View style={styles.summaryHeader}>
//             <Text style={styles.summaryTitle}>📱 QR Code Generated</Text>
//             <TouchableOpacity
//               style={styles.detailsToggle}
//               onPress={toggleDetails}
//             >
//               <Text style={styles.detailsToggleText}>
//                 {showDetails ? 'Hide Details' : 'Show Details'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Event:</Text>
//             <Text style={styles.summaryValue}>{qrData.event.title}</Text>
//           </View>

//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Date:</Text>
//             <Text style={styles.summaryValue}>{qrData.event.date}</Text>
//           </View>

//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Intent:</Text>
//             <Text style={styles.summaryValue}>{qrData.event.intent}</Text>
//           </View>

//           <View style={styles.summaryItem}>
//             <Text style={styles.summaryLabel}>Organizer:</Text>
//             <Text style={styles.summaryValue}>
//               {`${qrData.user.firstName} ${qrData.user.lastName}`}
//             </Text>
//           </View>
//         </View>

//         {/* Detailed Information (Collapsible) */}
//         {showDetails && (
//           <Animated.View style={styles.detailsContainer}>
//             <Text style={styles.detailsTitle}>Complete QR Data</Text>
//             <View style={styles.jsonContainer}>
//               <Text style={styles.jsonText}>
//                 {JSON.stringify(qrData, null, 2)}
//               </Text>
//             </View>
//           </Animated.View>
//         )}

//         {/* Action Buttons */}
//         <View style={styles.actionContainer}>
//           <TouchableOpacity
//             style={[styles.primaryButton, isProcessing && styles.disabledButton]}
//             onPress={handleShareQR}
//             activeOpacity={0.8}
//             disabled={isProcessing}
//           >
//             <Text style={styles.primaryButtonText}>
//               {isProcessing ? '⏳ Processing...' : '📤 Share QR Code'}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.secondaryButtonsRow}>
//             <TouchableOpacity
//               style={[styles.secondaryButton, isProcessing && styles.disabledButton]}
//               onPress={handleDownloadQR}
//               activeOpacity={0.8}
//               disabled={isProcessing}
//             >
//               <Text style={styles.secondaryButtonText}>💾 Download</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.secondaryButton}
//               onPress={handleCopyData}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.secondaryButtonText}>📋 Copy Data</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 18,
//     color: '#7F8C8D',
//   },
//   header: {
//     backgroundColor: '#27AE60',
//     paddingTop: 20,
//     paddingBottom: 40,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   headerContent: {
//     paddingHorizontal: 20,
//   },
//   backButton: {
//     alignSelf: 'flex-start',
//     marginBottom: 20,
//   },
//   backButtonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#A8E6C8',
//   },
//   scrollContent: {
//     paddingTop: 30,
//     paddingHorizontal: 24,
//     paddingBottom: 30,
//   },
//   qrContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   qrCodeWrapper: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   qrLabel: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#7F8C8D',
//     textAlign: 'center',
//   },
//   summaryContainer: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//   },
//   summaryHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   summaryTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#27AE60',
//   },
//   detailsToggle: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: '#27AE60',
//     borderRadius: 16,
//   },
//   detailsToggleText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   summaryItem: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 16,
//     color: '#7F8C8D',
//     fontWeight: '600',
//     width: 80,
//   },
//   summaryValue: {
//     fontSize: 16,
//     color: '#2C3E50',
//     flex: 1,
//   },
//   detailsContainer: {
//     backgroundColor: '#F1F2F6',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//   },
//   detailsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginBottom: 12,
//   },
//   jsonContainer: {
//     backgroundColor: '#2C3E50',
//     borderRadius: 8,
//     padding: 12,
//   },
//   jsonText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
//     lineHeight: 18,
//   },
//   actionContainer: {
//     marginTop: 10,
//   },
//   primaryButton: {
//     backgroundColor: '#27AE60',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 16,
//     shadowColor: '#27AE60',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   primaryButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   secondaryButtonsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   secondaryButton: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     flex: 0.48,
//     borderWidth: 2,
//     borderColor: '#E8E8E8',
//   },
//   secondaryButtonText: {
//     fontSize: 14,
//     color: '#27AE60',
//     fontWeight: '600',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default QrCodeScreen;


import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
  Share,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import RNShare from 'react-native-share';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const { width, height } = Dimensions.get('window');

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  dateOfBirth: string;
}

interface EventDetails {
  title: string;
  date: string;
  intent: string;
}

interface QRData {
  user: UserDetails;
  event: EventDetails;
  generatedAt: string;
  qrId: string;
}
  const vCardData = `
BEGIN:VCARD
VERSION:3.0
N:Smith;John;;;
TEL;TYPE=work,VOICE:(111) 555-1212
TEL;TYPE=home,VOICE:(404) 386-1017
TEL;TYPE=fax:(866) 408-1212
EMAIL:smith.j@smithdesigns.com
ORG:Smith Designs LLC
TITLE:Lead Designer
ADR;TYPE=WORK,PREF:;;151 Moore Avenue;Grand Rapids;MI;49503;United States of America
URL:https://www.smithdesigns.com
END:VCARD
  `.trim();



  const baseUrl = "http://harshpatel958.github.io/kontax-landing/";
const VCardData = {
    name: "John Doe",
    title: "Software Engineer",
    company: "Tech Corp",
    phone: "+1-555-123-4567",
    email: "john@example.com",
    website: "johndoe.com",
    address: "123 Main St, City, State"
};
// Encode the data for URL
const params = new URLSearchParams();
Object.keys(VCardData).forEach(key => {
    if (VCardData[key]) {
        params.append(key, VCardData[key]);
    }
});
const finalUrl = `${baseUrl}?${params.toString()}`;
// Sample data - in real app, this would come from props/navigation params
const sampleUserData: UserDetails = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street',
  city: 'New York',
  zipCode: '10001',
  dateOfBirth: '01/15/1990',
};

const sampleEventData: EventDetails = {
  title: 'Tech Networking Meetup',
  date: '12/25/2024',
  intent: 'Networking',
};

const QrCodeScreen: React.FC = () => {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Create a proper ref for QR Code
  const qrRef = useRef<any>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const qrScaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Generate QR data
    const qrDataObject: QRData = {
      user: sampleUserData,
      event: sampleEventData,
      generatedAt: new Date().toISOString(),
      qrId: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setQrData(qrDataObject);

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(qrScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulse animation
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };


const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const apiLevel = Platform.constants?.Release || 0;

    if (parseInt(apiLevel, 10) >= 13) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};const handleShareQR = async () => {
  if (!qrData || !qrRef.current) {
    Alert.alert('Error', 'QR code or data not ready');
    return;
  }

  setIsProcessing(true);

  try {
    qrRef.current.toDataURL(async (dataURL) => {
      try {
        // Convert base64 to file
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
        const fileName = `qr-event-${Date.now()}.png`;
        const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

        await RNFS.writeFile(filePath, base64Data, 'base64');

        const shareMessage = `🎉 Event: ${qrData.event.title}
📅 Date: ${qrData.event.date}
👤 By: ${qrData.user.firstName} ${qrData.user.lastName}
📲 Scan QR to view in app`;

        const shareOptions = {
          title: `Event: ${qrData.event.title}`,
          message: shareMessage,
          url: 'file://' + filePath,
          type: 'image/png',
        };

        await RNShare.open(shareOptions);
        setIsProcessing(false);
      } catch (err) {
        console.error('Share failed:', err);
        fallbackShare('Event QR:\n' + JSON.stringify(qrData, null, 2));
        setIsProcessing(false);
      }
    });
  } catch (error) {
    console.error('Error:', error);
    fallbackShare('Event QR:\n' + JSON.stringify(qrData, null, 2));
    setIsProcessing(false);
  }
};

//   const handleShareQR = async () => {
//     if (!qrData) {
//       Alert.alert('Error', 'QR code data not available');
//       return;
//     }

//     if (!qrRef.current) {
//       Alert.alert('Error', 'QR code not ready for sharing');
//       return;
//     }

//     setIsProcessing(true);
    
//     try {
//       // Get QR code as SVG/Data URL
//       qrRef.current.toDataURL((dataURL: string) => {
//         const qrString = JSON.stringify(qrData, null, 2);
//         const eventTitle = qrData.event.title;
//         const eventDate = qrData.event.date;
//         const organizerName = `${qrData.user.firstName} ${qrData.user.lastName}`;

//         // Create comprehensive share message
//         const shareMessage = `🎉 Event QR Code - ${eventTitle}

// 📅 Date: ${eventDate}
// 👤 Organizer: ${organizerName}
// 🎯 Purpose: ${qrData.event.intent}

// 📱 Scan the QR code to get complete event details!

// Complete Data:
// ${qrString}`;

//         // Share using React Native Share with both text and QR image
//         const shareOptions = {
//           title: `Event QR Code - ${eventTitle}`,
//           message: shareMessage,
//           url: dataURL, // QR code image data URL
//           subject: `Invitation: ${eventTitle}`, // For email sharing
//           type: 'image/png',
//         };

//         RNShare.open(shareOptions)
//           .then((res) => {
//             console.log('Share result:', res);
//             setIsProcessing(false);
//           })
//           .catch((err) => {
//             console.log('Share error:', err);
//             // Fallback to native Share API
//             fallbackShare(shareMessage);
//           });
//       });
//     } catch (error) {
//       console.error('Error sharing QR code:', error);
//       const qrString = JSON.stringify(qrData, null, 2);
//       fallbackShare(`Event QR Code Data:\n\n${qrString}`);
//     }
//   };

  const fallbackShare = async (message: string) => {
    try {
      await Share.share({
        message,
        title: 'Event QR Code',
      });
      setIsProcessing(false);
    } catch (error) {
      console.error('Fallback share error:', error);
      Alert.alert('Error', 'Failed to share QR code');
      setIsProcessing(false);
    }
  };

  const handleCopyData = async () => {
    if (!qrData) {
      Alert.alert('Error', 'No data to copy');
      return;
    }

    try {
      const qrString = JSON.stringify(qrData, null, 2);
      await Clipboard.setString(qrString);
      
      Alert.alert(
        'Copied! ✅',
        'QR code data has been copied to clipboard',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Copy error:', error);
      Alert.alert('Error', 'Failed to copy data to clipboard');
    }
  };

  const handleDownloadQR = async () => {
    if (!qrData) {
      Alert.alert('Error', 'QR code data not available');
      return;
    }

    if (!qrRef.current) {
      Alert.alert('Error', 'QR code not ready for download');
      return;
    }

    setIsProcessing(true);

    try {
      // Request storage permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to download QR code');
        setIsProcessing(false);
        return;
      }

      // Get QR code as data URL
      qrRef.current.toDataURL(async (dataURL: string) => {
        try {
          // Create filename
          const fileName = `qr-code-${qrData.event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.png`;
          
          // Define file path
          const downloadDir = Platform.OS === 'ios' 
            ? RNFS.DocumentDirectoryPath 
            : RNFS.DownloadDirectoryPath;
          
          const filePath = `${downloadDir}/${fileName}`;

          // Convert data URL to base64
          const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');

          // Write file
          await RNFS.writeFile(filePath, base64Data, 'base64');

          // Save to camera roll (photo gallery)
          if (Platform.OS === 'ios') {
            await CameraRoll.save(filePath, { type: 'photo' });
          } else {
            // For Android, the file is already in Downloads folder
            // Optionally save to gallery as well
            try {
              await CameraRoll.save(filePath, { type: 'photo' });
            } catch (galleryError) {
              console.log('Gallery save failed, but file saved to Downloads');
            }
          }

          setIsProcessing(false);
          
          Alert.alert(
            'Download Successful! ✅',
            `QR code saved as:\n${fileName}\n\nLocation: ${Platform.OS === 'ios' ? 'Photos' : 'Downloads folder & Gallery'}`,
            [
              { text: 'OK', style: 'default' },
              { 
                text: 'Open File', 
                style: 'default',
                onPress: () => {
                  // Optionally open file or show in file manager
                  console.log('File saved at:', filePath);
                }
              }
            ]
          );

        } catch (fileError) {
          console.error('File save error:', fileError);
          setIsProcessing(false);
          Alert.alert('Error', 'Failed to save QR code to device');
        }
      });

    } catch (error) {
      console.error('Download error:', error);
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to download QR code');
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!qrData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating QR Code...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Create QR code data string
  const qrCodeValue = JSON.stringify(qrData);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27AE60" />
      
      {/* Header */}
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event QR Code</Text>
          <Text style={styles.headerSubtitle}>Share your event details instantly</Text>
        </Animated.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* QR Code Container */}
        <Animated.View
          style={[
            styles.qrContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: qrScaleAnim },
                { scale: pulseAnim }
              ],
            },
          ]}
        >
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={ finalUrl }
              size={200}
              ref={qrRef}
              backgroundColor="white"
              color="black"
              getRef={(c) => {
               
                if (c) {
                  qrRef.current = c;
                }
              }}
            />
          </View>
          <Text style={styles.qrLabel}>Scan to view details</Text>
        </Animated.View>

        {/* Event Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>📱 QR Code Generated</Text>
            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={toggleDetails}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Event:</Text>
            <Text style={styles.summaryValue}>{qrData.event.title}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{qrData.event.date}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Intent:</Text>
            <Text style={styles.summaryValue}>{qrData.event.intent}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Organizer:</Text>
            <Text style={styles.summaryValue}>
              {`${qrData.user.firstName} ${qrData.user.lastName}`}
            </Text>
          </View>
        </View>

        {/* Detailed Information (Collapsible) */}
        {showDetails && (
          <Animated.View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Complete QR Data</Text>
            <View style={styles.jsonContainer}>
              <Text style={styles.jsonText}>
                {JSON.stringify(qrData, null, 2)}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isProcessing && styles.disabledButton]}
            onPress={handleShareQR}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <Text style={styles.primaryButtonText}>
              {isProcessing ? '⏳ Processing...' : '📤 Share QR Code'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, isProcessing && styles.disabledButton]}
              onPress={handleDownloadQR}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              <Text style={styles.secondaryButtonText}>💾 Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleCopyData}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>📋 Copy Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Debug Info (Remove in production) */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            QR Ref Status: {qrRef.current ? '✅ Ready' : '❌ Not Ready'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7F8C8D',
  },
  header: {
    backgroundColor: '#27AE60',
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A8E6C8',
  },
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  qrLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  detailsToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#27AE60',
    borderRadius: 16,
  },
  detailsToggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '600',
    width: 80,
  },
  summaryValue: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  jsonContainer: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    padding: 12,
  },
  jsonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#27AE60',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 0.48,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Debug styles (Remove in production)
  debugContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});

export default QrCodeScreen;