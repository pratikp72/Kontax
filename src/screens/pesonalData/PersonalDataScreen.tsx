import React, { useRef, useEffect } from 'react';
import IconT from 'react-native-vector-icons/FontAwesome';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
organization:string;
designation:string;
linkedln:string
}

// Sample data - in real app, this would come from props, state management, or API
const sampleData: PersonalDetails = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
 designation:'to be developer',
 organization:'ttt',
 linkedln:'www.link.com'
};

const PersonalDataScreen: React.FC = () => {

    const navigation=useNavigation()
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateEvent = () => {
  navigation.navigate('CreateEvent')
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Navigate to edit profile screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => console.log('Navigate to edit profile') },
      ]
    );
  };

  const renderDetailItem = (icon: React.ReactNode, label: string, value: string, isLast = false) => (
    <View style={[styles.detailItem, !isLast && styles.detailItemBorder]}>
      <View style={styles.detailIcon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3498DB" />
      
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
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(sampleData.firstName, sampleData.lastName)}
            </Text>
          </View>
          <Text style={styles.headerName}>
            {`${sampleData.firstName} ${sampleData.lastName}`}
          </Text>
          <Text style={styles.headerEmail}>{sampleData.email}</Text>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <View style={styles.editButtonT}><Icon name="edit" size={24} color="white" /> <Text style={styles.editButtonText}>Edit Profile</Text></View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Details Card */}
      <Animated.View
        style={[
          styles.detailsCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.detailsContainer}>
            {renderDetailItem(<Icon name="person" size={24} color="#4292c6" />, 'First Name', sampleData.firstName)}
            {renderDetailItem(<Icon name="person" size={24} color="#4292c6" />, 'Last Name', sampleData.lastName)}
            {renderDetailItem(<Icon name="email" size={24} color="#4292c6" />, 'Email', sampleData.email)}
            {renderDetailItem(<Icon name="phone" size={24} color="#4292c6" />, 'Phone', sampleData.phone)}
            {renderDetailItem(<Icon name="home" size={24} color="#4292c6" />, 'Organization', sampleData.organization)}
            {renderDetailItem(<Icon name="work" size={24} color="#4292c6" />, 'Designation', sampleData.designation)}
            {renderDetailItem(<IconT name="linkedin-square" size={24} color="#0077B5" />, 'Linkedln', sampleData.linkedln)}
   
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.createEventButton}
                onPress={handleCreateEvent}
                activeOpacity={0.9}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonIcon}>🎉</Text>
                  <View>
                    <Text style={styles.buttonTitle}>Create Event</Text>
                    <Text style={styles.buttonSubtitle}>Plan something amazing</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>📅 View My Events</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#3498DB',
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498DB',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 16,
    color: '#E8F4FD',
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonT: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
   gap:4,
    alignSelf:'center'
  },
   editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
   flexDirection:'row',
   justifyContent:'center',
   alignItems:'center',
   gap:4,
    alignSelf:'center'
  },
  detailsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  detailsContainer: {
    paddingHorizontal: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  createEventButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#3498DB',
    fontWeight: '600',
  },
});

export default PersonalDataScreen;