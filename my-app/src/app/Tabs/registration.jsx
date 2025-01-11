import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RegistrationPage = ({ navigation }) => {
  const [accountType, setAccountType] = useState('business'); // Default to business owner

  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [financialNeeds, setFinancialNeeds] = useState('');
  const [revenue, setRevenue] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [certifications, setCertifications] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState('');
  const [website, setWebsite] = useState('');

  const handleRegister = () => {
    console.log('Account Type:', accountType);
    if (accountType === 'business') {
      console.log('Business Name:', businessName);
      console.log('Industry:', industry);
      console.log('Location:', location);
      console.log('Financial Needs:', financialNeeds);
      console.log('Revenue:', revenue);
      console.log('Employee Count:', employeeCount);
      console.log('Business Description:', businessDescription);
      console.log('Email:', email);
      console.log('Phone:', phone);
    } else {
      console.log('Name:', name);
      console.log('Title:', title);
      console.log('Certifications:', certifications);
      console.log('Years Experience:', yearsExperience);
      console.log('Specializations:', specializations);
      console.log('Education:', education);
      console.log('Bio:', bio);
      console.log('Email:', email);
      console.log('Phone:', phone);
      console.log('Languages:', languages);
      console.log('Website:', website);
    }

    navigation.navigate('ProfilePage', { accountType });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registration</Text>

      {/* Account Type Selection */}
      <View style={styles.accountTypeContainer}>
        <TouchableOpacity
          style={[styles.accountTypeButton, accountType === 'business' && styles.selectedButton]}
          onPress={() => setAccountType('business')}
        >
          <Text style={styles.buttonText}>Business Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.accountTypeButton, accountType === 'advisor' && styles.selectedButton]}
          onPress={() => setAccountType('advisor')}
        >
          <Text style={styles.buttonText}>Financial Advisor</Text>
        </TouchableOpacity>
      </View>

      {/* Business Owner Fields */}
      {accountType === 'business' && (
        <View style={styles.fieldsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Industry"
            value={industry}
            onChangeText={setIndustry}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Financial Needs"
            value={financialNeeds}
            onChangeText={setFinancialNeeds}
          />
          <TextInput
            style={styles.input}
            placeholder="Revenue"
            value={revenue}
            onChangeText={setRevenue}
          />
          <TextInput
            style={styles.input}
            placeholder="Employee Count"
            value={employeeCount}
            onChangeText={setEmployeeCount}
          />
          <TextInput
            style={styles.input}
            placeholder="Business Description"
            value={businessDescription}
            onChangeText={setBusinessDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      )}

      {/* Financial Advisor Fields */}
      {accountType === 'advisor' && (
        <View style={styles.fieldsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Certifications (comma separated)"
            value={certifications}
            onChangeText={setCertifications}
          />
          <TextInput
            style={styles.input}
            placeholder="Years of Experience"
            value={yearsExperience}
            onChangeText={setYearsExperience}
          />
          <TextInput
            style={styles.input}
            placeholder="Specializations (comma separated)"
            value={specializations}
            onChangeText={setSpecializations}
          />
          <TextInput
            style={styles.input}
            placeholder="Education"
            value={education}
            onChangeText={setEducation}
          />
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />
          <TextInput
            style={styles.input}
            placeholder="Languages (comma separated)"
            value={languages}
            onChangeText={setLanguages}
          />
          <TextInput
            style={styles.input}
            placeholder="FSP Number"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      )}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  accountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  accountTypeButton: {
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#2196f3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RegistrationPage;