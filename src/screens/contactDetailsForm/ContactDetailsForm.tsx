import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import useScanStore from '../../store/useScanStore';
import {useEventStore} from '../../store/useEventStore';

const {width} = Dimensions.get('window');

const ContactDetailsForm = () => {
  const [currentScreen, setCurrentScreen] = useState('form');

  type FormData = {
    firstName: string;
    lastName: string;

    name: {
      firstName: string;
      lastName: string;
    };
    organization: string;
    designation: string;
    phone: string;

    email: string;
    url: string;
    linkedln: string;
    notes?: string;
    tags?: string;
  };

  const {qrData: formData, clearQrData} = useScanStore() as {
    qrData: FormData;
    clearQrData: (value: string) => void;
  };
  
  const {eventData} = useEventStore();

 
  const isFormValid = () => {
    return (
      formData.firstName?.trim() ||
      formData.name?.firstName?.trim() ||
      formData.lastName?.trim() ||
      formData.name?.lastName?.trim() ||
      formData.email?.trim()
    );
  };

  const generateVCard = () => {
    const card = new vCard();

    // Determine best firstName and lastName (prioritize top-level fields first)
    const firstName =
      formData.firstName?.trim() || formData.name?.firstName?.trim() || '';
    const lastName =
      formData.lastName?.trim() || formData.name?.lastName?.trim() || '';

    if (firstName || lastName) {
      card.addName(lastName, firstName);
      card.addFormattedName(`${firstName} ${lastName}`.trim());
    }

    if (formData.organization) {
      card.addOrganization(formData.organization);
    }

    if (formData.designation) {
      card.addJobtitle(formData.designation);
    }

    const phoneNumber =
      formData.phone?.trim() || formData.phone?.number?.trim() || '7687686886';
    if (phoneNumber) {
      card.addPhoneNumber(phoneNumber, 'WORK');
    }

    if (formData.email) {
      card.addEmail(formData.email, 'WORK');
    }
    if (formData.url) {
      card.addURL(formData.url);
    }
    if (formData.linkedln) {
      card.addURL(formData.linkedln);
    }

    // Add event information as a note
    const eventNote = `Event: ${eventData.title} | Date: ${
      eventData.date
    } | Location: ${'udaipur'}`;
    const fullNote = formData.notes
      ? `${formData.notes}\n\n${eventNote}`
      : eventNote;
    card.addNote(fullNote);

    // Add tags as categories
    const allTags = [];
    if (formData.tags) {
      const personalTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      allTags.push(...personalTags);
    }
    if (eventData.eventTag) {
      const eventTags = eventData.eventTag
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      allTags.push(...eventTags);
    }
    if (eventData.intent) {
      allTags.push(`intent:${eventData.intent}`);
    }

    if (allTags.length > 0) {
      card.addCategories(allTags);
    }

    return card.getFormattedString();
  };

  const createVCard = () => {
    if (isFormValid()) {
      setCurrentScreen('vcard');
    } else {
      Alert.alert(
        'Validation Error',
        'Please enter at least First Name, Last Name, or Email.',
      );
    }
  };

  const clearForm = () => {
    clearQrData('');
  };

  const shareVCard = async () => {
    try {
      const vCardString = generateVCard();
      const fullName =
        `${formData.firstName || ''} ${formData.lastName || ''}`.trim() ||
        `${formData.name?.firstName || ''} ${
          formData.name?.lastName || ''
        }`.trim() ||
        'Contact';

      await Share.share({
        message: vCardString,
        title: `${fullName} - Contact Card`,
      });
    } catch (error) {
      console.log('Error sharing vCard:', error);
      // Alert.alert('Error', 'Failed to share contact card');
    }
  };
  const [yourData, setYourData] = useState({
    note: '',
    tags: '',
    // add other fields as needed
  });

  const updateField = (field, value) => {
    setYourData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  const getProfileInitials = () => {
    const firstInitial =
      formData.firstName?.charAt(0)?.toUpperCase() ||
      formData.name?.firstName?.charAt(0)?.toUpperCase() ||
      '';
    const lastInitial =
      formData.lastName?.charAt(0)?.toUpperCase() ||
      formData.name?.lastName?.charAt(0)?.toUpperCase() ||
      '';

    return `${firstInitial}${lastInitial}` || 'UC';
  };

  const getTagsPreview = () => {
    let allTags = [];

    if (yourData.tags) {
      const personalTags = yourData.tags
        .split(',')
        .map(tag => tag?.trim())
        .filter(tag => tag.length > 0);
      allTags = allTags.concat(personalTags);
    }

    if (eventData.eventTag) {
      const eventTags = eventData.eventTag
        .split(',')
        .map(tag => tag?.trim())
        .filter(tag => tag.length > 0);
      allTags = allTags.concat(eventTags);
    }

    if (eventData.intent) {
      allTags.push(`intent:${eventData.intent}`);
    }

    return allTags;
  };

  if (currentScreen === 'vcard') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
          <TouchableOpacity
            onPress={() => setCurrentScreen('form')}
            style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back to Form</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Card</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.profileImageContainer}>
              <Text style={styles.profileInitials}>{getProfileInitials()}</Text>
            </LinearGradient>

            <Text style={styles.profileName}>
              {formData?.firstName || formData.name.firstName}{' '}
              {formData?.lastName || formData.name.lastName}
            </Text>

            {formData.designation && (
              <Text style={styles.profileDesignation}>
                {formData.designation}
              </Text>
            )}

            {formData.organization && (
              <Text style={styles.profileOrganization}>
                {formData.organization}
              </Text>
            )}
          </View>

          {/* Contact Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            {formData.email && (
              <View style={styles.infoRow}>
                <Icon name="mail" size={20} color="#6366f1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{formData.email}</Text>
                </View>
              </View>
            )}

            {/* {formData.phone && (
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#6366f1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formData?.phone||"87787867656"}</Text>
                </View>
              </View>
            )} */}

            {formData.linkedln && formData.url && (
              <View style={styles.infoRow}>
                <Icon name="globe" size={20} color="#6366f1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>linkedln</Text>
                  <Text style={styles.infoValue}>
                    {formData.linkedln || formData.url}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Event Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Event Details</Text>

            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Event</Text>
                <Text style={styles.infoValue}>{eventData.title || 'top'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="clock" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {eventData.date || '7/10/2023'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="map-pin" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {eventData.eventLocation || 'ggg'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="target" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Purpose</Text>
                <Text style={styles.infoValue}>{eventData.intent || 'no'}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {yourData.note && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Personal Notes</Text>
              <Text style={styles.notesText}>{yourData.note}</Text>
            </View>
          )}

          {/* Tags */}
          {getTagsPreview().length > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {getTagsPreview().map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={shareVCard} style={styles.shareButton}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.gradientButton}>
                <Icon name="share-2" size={20} color="#fff" />
                <Text style={styles.buttonText}>Share vCard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Main Form Screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
        <Text style={styles.headerTitle}>vCard Creator</Text>
        <Text style={styles.headerSubtitle}>
          Create professional contact cards
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, {flex: 1, marginRight: 8}]}>
              <Icon
                name="user"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="First Name"
                value={formData.firstName || formData.name.firstName}
                style={styles.textInput}
                placeholderTextColor="#9ca3af"
                editable={false}
              />
            </View>

            <View style={[styles.inputContainer, {flex: 1, marginLeft: 8}]}>
              <Icon
                name="user"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Last Name"
                value={formData.lastName || formData.name.lastName}
                style={styles.textInput}
                placeholderTextColor="#9ca3af"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="briefcase"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Organization"
              value={formData.organization}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="award"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Job Title / Designation"
              value={formData.designation}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              editable={false}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Details</Text>

          <View style={styles.inputContainer}>
            <Icon
              name="phone"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={formData.phone}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="mail"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email Address"
              keyboardType="email-address"
              value={formData.email}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="globe"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Linkedln"
              value={formData.linkedln || formData.url}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              editable={false}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <View style={styles.inputContainer}>
            <Icon
              name="edit-3"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Personal Notes"
              value={yourData.note}
              onChangeText={text => updateField('note', text)}
              style={[styles.textInput, styles.multilineInput]}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="tag"
              size={18}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Tags (comma separated)"
              value={yourData.tags}
              onChangeText={text => updateField('tags', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={createVCard} style={styles.createButton}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.gradientButton}>
              <Icon name="credit-card" size={20} color="#fff" />
              <Text style={styles.buttonText}>Create vCard</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={clearForm} style={styles.clearButton}>
            <Icon name="refresh-cw" size={20} color="#6b7280" />
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formSection: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileInitials: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  profileDesignation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 3,
  },
  profileOrganization: {
    fontSize: 16,
    color: '#9ca3af',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  notesText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  actionButtons: {
    marginTop: 30,
    marginBottom: 40,
  },
  createButton: {
    marginBottom: 15,
  },
  shareButton: {
    marginBottom: 15,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  clearButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ContactDetailsForm;
