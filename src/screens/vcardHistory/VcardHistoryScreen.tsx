
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useScanDetails } from '../../services/useScanDetails';
import Icon1 from 'react-native-vector-icons/MaterialIcons'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import VoiceNotePlayer from '../../components/VouceNotePlayer';



const EventHistoryScreen = () => {
  const { vcardDetails,deleteVcardDetail } = useScanDetails();
  const navigation=useNavigation();

  const handleLinkPress = (url) => {
    if (url) {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const handleEmailPress = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handlePhonePress = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };
const handleDelete = (id) => {
  Alert.alert(
    'Delete Entry',
    'Are you sure you want to delete this card?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteVcardDetail(id); 
          } catch (error) {
            console.error('Failed to delete vCard detail:', error);
          }
        },
      },
    ]
  );
};


  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };


const renderItem = ({ item, index }) => (
  <View style={[styles.card, { marginTop: index === 0 ? 8 : 0 }]}>
    {/* Header with Avatar and Name */}

     <TouchableOpacity
      style={styles.deleteIcon}
      onPress={() => handleDelete(item.id)}
    >
      <Icon1 name="delete" size={24} color="#ff4d4d" />
    </TouchableOpacity>
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {getInitials(item.firstName, item.lastName)}
        </Text>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.designation}>
          {item.designation} {item.organization && `at ${item.organization}`}
        </Text>
      </View>
    </View>

    {/* Contact Information */}
    <View style={styles.contactSection}>
      {item.email && (
        <TouchableOpacity style={styles.contactRow} onPress={() => handleEmailPress(item.email)}>
          <Text style={styles.contactIcon}>📧</Text>
          <Text style={[styles.contactText, styles.linkText]}>{item.email}</Text>
        </TouchableOpacity>
      )}
      {item.phone && (
        <TouchableOpacity style={styles.contactRow} onPress={() => handlePhonePress(item.phone)}>
          <Text style={styles.contactIcon}>📞</Text>
          <Text style={[styles.contactText, styles.linkText]}>{item.phone}</Text>
        </TouchableOpacity>
      )}
      {item.linkedln && (
        <TouchableOpacity style={styles.contactRow} onPress={() => handleLinkPress(item.linkedln)}>
          <Text style={styles.contactIcon}>💼</Text>
          <Text style={[styles.contactText, styles.linkText]}>LinkedIn Profile</Text>
        </TouchableOpacity>
      )}
      {item.location && (
        <View style={styles.contactRow}>
          <Text style={styles.contactIcon}>📍</Text>
          <Text style={styles.contactText}>{item.location}</Text>
        </View>
      )}

      {/* Event Title */}
      {item.title && (
        <View style={styles.contactRow}>
          <Text style={styles.contactIcon}>🎫</Text>
          <Text style={styles.contactText}>Event: {item.title}</Text>
        </View>
      )}

      {/* Intent */}
      {item.intent && (
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Intent:</Text>
          <Text style={styles.intentText}>{item.intent}</Text>
        </View>
      )}

      {/* Notes */}
      {item.notes && (
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Notes:</Text>
          <Text style={styles.intentText}>{item.notes}</Text>
        </View>
      )}

      {/* Your Intent */}
      {item.yourIntent && (
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Your Intent:</Text>
          <Text style={styles.intentText}>{item.yourIntent}</Text>
        </View>
      )}

      {/* Tags */}
      {item.tags && (
        <View style={styles.intentRow}>
          <Text style={styles.intentLabel}>Tags:</Text>
          <Text style={styles.intentText}>{item.tags}</Text>
        </View>
      )}


      {item.audio && (
  <View style={styles.contactRow}>
    <Text style={styles.intentLabel}>Voice Note</Text>
    <VoiceNotePlayer audioPath={item.audio} />
  </View>

      )}
    </View>

    {/* Footer with Date */}
    <View style={styles.footer}>
      <Text style={styles.dateText}>
        Scanned on {formatDate(item.eventDetails?.date || item.date)}
      </Text>
    </View>
  </View>
);

  return (
    <View style={styles.container}>
        <View style={{   backgroundColor:'#87CEFA',  height:100,borderBottomLeftRadius:30,borderBottomRightRadius:30,}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{
       
        }}>
        <View style={{flexDirection:'row', gap:8,left:30,paddingTop:30,alignItems:'center',}}><Icon name="arrow-back" size={24} color="white" /><Text style={{color:'white',fontSize:18}}>Back</Text></View></TouchableOpacity></View>
      <FlatList
        data={vcardDetails}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📇</Text>
            <Text style={styles.emptyTitle}>No Contact Cards Yet</Text>
            <Text style={styles.emptySubtitle}>
              Scanned business cards will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default EventHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
 
  },

  deleteIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 10,
  padding: 4,
},

  card: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  designation: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  contactSection: {
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  contactText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
    fontWeight: '500',
  },
  linkText: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
  intentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    marginTop: 4,
  },
  intentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginRight: 8,
  },
  intentText: {
    fontSize: 14,
    color: '#92400e',
    flex: 1,
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
});