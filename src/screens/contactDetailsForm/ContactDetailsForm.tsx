





import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // You can install this package

const ContactDetailsForm = () => {
  const [currentScreen, setCurrentScreen] = useState('form'); // 'form' or 'vcard'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    designation: '',
    phone: '',
    email: '',
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

  const createVCard = () => {
    if (isFormValid()) {
      setCurrentScreen('vcard');
    } else {
      Alert.alert('Validation', 'Please enter at least First Name, Last Name, or Email.');
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
      notes: '',
      tags: '',
    });
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

    return allTags.join(', ');
  };

  const shareVCard = async () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const shareText = `Contact: ${fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nEvent: ${eventData.eventTitle}\nDate: ${eventData.eventDate}`;

    try {
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const getProfileInitials = () => {
    const firstInitial = formData.firstName.charAt(0).toUpperCase();
    const lastInitial = formData.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}` || 'U';
  };

  if (currentScreen === 'vcard') {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#f0f4ff', padding: 16 }}>
        <TouchableOpacity
          onPress={() => setCurrentScreen('form')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Icon name="arrow-left" size={24} color="#333" />
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Back to Form</Text>
        </TouchableOpacity>

        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          alignItems: 'center',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#4f46e5',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 32, color: '#fff', fontWeight: 'bold' }}>
              {getProfileInitials()}
            </Text>
          </View>

          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
            {formData.firstName} {formData.lastName}
          </Text>

          {formData.designation ? (
            <Text style={{ fontSize: 16, color: '#555' }}>{formData.designation}</Text>
          ) : null}

          {formData.organization ? (
            <Text style={{ fontSize: 16, color: '#777' }}>{formData.organization}</Text>
          ) : null}
        </View>

        {/* Contact Info */}
        {formData.email ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Email:</Text>
            <Text>{formData.email}</Text>
          </View>
        ) : null}

        {formData.phone ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Phone:</Text>
            <Text>{formData.phone}</Text>
          </View>
        ) : null}

        {/* Event Info */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Event Details</Text>

          <Text style={{ fontWeight: 'bold' }}>Event:</Text>
          <Text>{eventData.eventTitle}</Text>

          <Text style={{ fontWeight: 'bold' }}>Date:</Text>
          <Text>{eventData.eventDate}</Text>

          <Text style={{ fontWeight: 'bold' }}>Location:</Text>
          <Text>{eventData.eventLocation}</Text>

          <Text style={{ fontWeight: 'bold' }}>Purpose:</Text>
          <Text>{eventData.intent}</Text>

          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Event Note:</Text>
          <Text>{eventData.eventNote}</Text>
        </View>

        {/* Notes */}
        {formData.notes ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Personal Notes:</Text>
            <Text>{formData.notes}</Text>
          </View>
        ) : null}

        {/* Tags */}
        {getTagsPreview() ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Tags:</Text>
            <Text>{getTagsPreview()}</Text>
          </View>
        ) : null}

        {/* Actions */}
        <TouchableOpacity
          onPress={shareVCard}
          style={{
            backgroundColor: '#10b981',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Share Contact
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Main Form Screen
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f4ff', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>vCard Creator</Text>

      <TextInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={text => updateField('firstName', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={text => updateField('lastName', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Organization"
        value={formData.organization}
        onChangeText={text => updateField('organization', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Designation"
        value={formData.designation}
        onChangeText={text => updateField('designation', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Phone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={text => updateField('phone', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => updateField('email', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Personal Notes"
        value={formData.notes}
        onChangeText={text => updateField('notes', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
        multiline
      />

      <TextInput
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChangeText={text => updateField('tags', text)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      />

      {/* Form Actions */}
      <TouchableOpacity
        onPress={createVCard}
        style={{
          backgroundColor: '#4f46e5',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          Create vCard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={clearForm}
        style={{
          backgroundColor: '#d1d5db',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Clear Form
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ContactDetailsForm;
