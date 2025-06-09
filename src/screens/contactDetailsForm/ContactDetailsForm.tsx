
import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const ContactDetailsForm = () => {
  const [currentScreen, setCurrentScreen] = useState('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    designation: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    notes: '',
    tags: '',
  });

  const eventData = {
    eventTitle: 'Annual Tech Conference 2024',
    eventDate: 'December 15, 2024',
    eventLocation: 'Convention Center, Downtown',
    intent: 'networking',
    createdBy: 'Conference Organizer',
    eventTag: 'tech, conference, networking',
    eventNote: 'Annual technology conference featuring keynote speakers and networking opportunities.',
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() ||
      formData.lastName.trim() ||
      formData.email.trim()
    );
  };

  const generateVCard = () => {
    const card = new vCard();
    
    // Basic information
    if (formData.firstName || formData.lastName) {
      card.addName(formData.lastName, formData.firstName);
    }
    
    if (formData.firstName || formData.lastName) {
      card.addFormattedName(`${formData.firstName} ${formData.lastName}`.trim());
    }
    
    if (formData.organization) {
      card.addOrganization(formData.organization);
    }
    
    if (formData.designation) {
      card.addJobtitle(formData.designation);
    }
    
    if (formData.phone) {
      card.addPhoneNumber(formData.phone, 'WORK');
    }
    
    if (formData.email) {
      card.addEmail(formData.email, 'WORK');
    }
    
    if (formData.website) {
      card.addURL(formData.website);
    }
    
    if (formData.address) {
      card.addAddress('', '', formData.address, '', '', '', '', 'WORK');
    }
    
    // Add event information as a note
    const eventNote = `Event: ${eventData.eventTitle} | Date: ${eventData.eventDate} | Location: ${eventData.eventLocation}`;
    const fullNote = formData.notes ? `${formData.notes}\n\n${eventNote}` : eventNote;
    card.addNote(fullNote);
    
    // Add tags as categories
    const allTags = [];
    if (formData.tags) {
      const personalTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      allTags.push(...personalTags);
    }
    if (eventData.eventTag) {
      const eventTags = eventData.eventTag.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
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
      Alert.alert('Validation Error', 'Please enter at least First Name, Last Name, or Email.');
    }
  };

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      organization: '',
      designation: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      notes: '',
      tags: '',
    });
  };

  const shareVCard = async () => {
    try {
      const vCardString = generateVCard();
      const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Contact';
      
      await Share.share({
        message: vCardString,
        title: `${fullName} - Contact Card`,
      });
    } catch (error) {
      console.log('Error sharing vCard:', error);
      // Alert.alert('Error', 'Failed to share contact card');
    }
  };

  const getProfileInitials = () => {
    const firstInitial = formData.firstName.charAt(0).toUpperCase();
    const lastInitial = formData.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}` || 'UC';
  };

  const getTagsPreview = () => {
    let allTags = [];

    if (formData.tags) {
      const personalTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      allTags = allTags.concat(personalTags);
    }

    if (eventData.eventTag) {
      const eventTags = eventData.eventTag
        .split(',')
        .map(tag => tag.trim())
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
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() => setCurrentScreen('form')}
            style={styles.backButton}
          >
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
              style={styles.profileImageContainer}
            >
              <Text style={styles.profileInitials}>
                {getProfileInitials()}
              </Text>
            </LinearGradient>

            <Text style={styles.profileName}>
              {formData.firstName} {formData.lastName}
            </Text>

            {formData.designation && (
              <Text style={styles.profileDesignation}>{formData.designation}</Text>
            )}

            {formData.organization && (
              <Text style={styles.profileOrganization}>{formData.organization}</Text>
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

            {formData.phone && (
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#6366f1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{formData.phone}</Text>
                </View>
              </View>
            )}

            {formData.website && (
              <View style={styles.infoRow}>
                <Icon name="globe" size={20} color="#6366f1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Website</Text>
                  <Text style={styles.infoValue}>{formData.website}</Text>
                </View>
              </View>
            )}

            {formData.address && (
              <View style={styles.infoRow}>
                <Icon name="map-pin" size={20} color="#6366f1" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{formData.address}</Text>
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
                <Text style={styles.infoValue}>{eventData.eventTitle}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="clock" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{eventData.eventDate}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="map-pin" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{eventData.eventLocation}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Icon name="target" size={20} color="#10b981" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Purpose</Text>
                <Text style={styles.infoValue}>{eventData.intent}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {formData.notes && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Personal Notes</Text>
              <Text style={styles.notesText}>{formData.notes}</Text>
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
                style={styles.gradientButton}
              >
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
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>vCard Creator</Text>
        <Text style={styles.headerSubtitle}>Create professional contact cards</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Icon name="user" size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={text => updateField('firstName', text)}
                style={styles.textInput}
                placeholderTextColor="#9ca3af"
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Icon name="user" size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={text => updateField('lastName', text)}
                style={styles.textInput}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="briefcase" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Organization"
              value={formData.organization}
              onChangeText={text => updateField('organization', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="award" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Job Title / Designation"
              value={formData.designation}
              onChangeText={text => updateField('designation', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          
          <View style={styles.inputContainer}>
            <Icon name="phone" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={text => updateField('phone', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="mail" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={text => updateField('email', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="globe" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Website URL"
              value={formData.website}
              onChangeText={text => updateField('website', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="map-pin" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Address"
              value={formData.address}
              onChangeText={text => updateField('address', text)}
              style={styles.textInput}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.inputContainer}>
            <Icon name="edit-3" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Personal Notes"
              value={formData.notes}
              onChangeText={text => updateField('notes', text)}
              style={[styles.textInput, styles.multilineInput]}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="tag" size={18} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              placeholder="Tags (comma separated)"
              value={formData.tags}
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
              style={styles.gradientButton}
            >
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 4 },
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
    shadowOffset: { width: 0, height: 2 },
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