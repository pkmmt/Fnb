import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Separate components for better organization
const EditableField = ({ isEditing, value, onChangeText, style, multiline = false }) => (
  isEditing ? (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
  ) : (
    <Text style={style}>{value}</Text>
  )
);

const ContactItem = ({ icon, value, isEditing, onChangeText }) => (
  <View style={styles.contactItem}>
    <MaterialIcons name={icon} size={24} color={styles.primaryColor} />
    <EditableField
      isEditing={isEditing}
      value={value}
      onChangeText={onChangeText}
      style={styles.contactText}
    />
  </View>
);

const BusinessProfile = ({ route, navigation }) => {
  const defaultData = {
    businessName: 'Tech Innovators Inc.',
    industry: 'Technology',
    location: 'Johannesburg, Gauteng, South Africa',
    revenue: 'R 50 000',
    employeeCount: '15',
    businessDescription: 'Tech Innovators Inc. is a leading provider of cutting-edge technologies...',
    email: 'info@techinnovators.com',
    phone: '(011) 987-6543',
    website: 'www.techinnovators.com',
    rating: 4.7,
    reviewCount: 54,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(route?.params || defaultData);
  const [tempFinancialNeed, setTempFinancialNeed] = useState('');

  const handleSave = useCallback(async () => {
    try {
      // API call 
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      
    }
  }, [editedData]);

  const updateField = useCallback((field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const addFinancialNeed = useCallback(() => {
    if (tempFinancialNeed.trim()) {
      setEditedData(prev => ({
        ...prev,
        financialNeeds: [...prev.financialNeeds, tempFinancialNeed.trim()]
      }));
      setTempFinancialNeed('');
    }
  }, [tempFinancialNeed]);

  const removeFinancialNeed = useCallback((index) => {
    setEditedData(prev => ({
      ...prev,
      financialNeeds: prev.financialNeeds.filter((_, i) => i !== index)
    }));
  }, []);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Image
        source={require('../assets/zandile.webp')}
        style={styles.profileImage}
      />
      <View style={styles.basicInfo}>
        <EditableField
          isEditing={isEditing}
          value={editedData.businessName}
          onChangeText={(text) => updateField('businessName', text)}
          style={styles.businessName}
        />
        <EditableField
          isEditing={isEditing}
          value={editedData.industry}
          onChangeText={(text) => updateField('industry', text)}
          style={styles.industry}
        />
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {editedData.rating}</Text>
          <Text style={styles.reviews}>({editedData.reviewCount} reviews)</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={() => setIsEditing(!isEditing)}
              >
                <MaterialIcons 
                  name={isEditing ? "close" : "edit"} 
                  size={24} 
                  color={styles.primaryColor} 
                />
                <Text style={styles.editButtonText}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Text>
              </TouchableOpacity>

              {renderHeader()}

              <View style={styles.divider} />

              {/* Business Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <EditableField
                  isEditing={isEditing}
                  value={editedData.businessDescription}
                  onChangeText={(text) => updateField('businessDescription', text)}
                  style={styles.descriptionText}
                  multiline
                />
              </View>

              {/* Financial Needs Section */}
              {/* Contact Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <ContactItem
                  icon="email"
                  value={editedData.email}
                  isEditing={isEditing}
                  onChangeText={(text) => updateField('email', text)}
                />
                <ContactItem
                  icon="phone"
                  value={editedData.phone}
                  isEditing={isEditing}
                  onChangeText={(text) => updateField('phone', text)}
                />
                <ContactItem
                  icon="language"
                  value={editedData.website}
                  isEditing={isEditing}
                  onChangeText={(text) => updateField('website', text)}
                />
              </View>

              {/* Action Button */}
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  isEditing && styles.saveButton
                ]} 
                onPress={isEditing ? handleSave : null}
              >
                <Text style={styles.actionButtonText}>
                  {isEditing ? 'Save Changes' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  basicInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  industry: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  needsList: {
    gap: 8,
  },
  needItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  needText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  actionButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#2196f3',
    marginLeft: 4,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  addNeedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  needInput: {
    flex: 1,
  },
  addNeedButton: {
    backgroundColor: '#2196f3',
    padding: 8,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  primaryColor: '#2196f3',
  errorColor: '#ff4444',
});

export default BusinessProfile;