import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Predefined credentials for different user roles
const CREDENTIALS = {
  BUSINESS_OWNER: {
    email: 'owner@business.com',
    password: 'owner123',
    role: 'owner'
  },
  ADVISOR: {
    email: 'advisor@business.com',
    password: 'advisor123',
    role: 'advisor'
  }
};

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Check if credentials match business owner
    if (email === CREDENTIALS.BUSINESS_OWNER.email && 
        password === CREDENTIALS.BUSINESS_OWNER.password) {
      router.replace('/Tabs/homepage');
      return;
    }
    
    // Check if credentials match advisor
    if (email === CREDENTIALS.ADVISOR.email && 
        password === CREDENTIALS.ADVISOR.password) {
      router.replace('/Tabs/advisor/offer');
      return;
    }

    // If no match found, show error
    Alert.alert(
      "Login Failed",
      "Invalid email or password. Please try again.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#ffffff', '#ffffff']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.innerContainer}>
            <Image
              source={require('../assets/brain.jpg')}
              style={styles.cartoonImage}
            />
            <Text style={styles.title}>Finance App</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            
            {/* Demo Credentials Display */}
            <View style={styles.demoCredentials}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.credentialText}>Business Owner:</Text>
              <Text style={styles.credentialDetail}>Email: owner@business.com</Text>
              <Text style={styles.credentialDetail}>Password: owner123</Text>
              <Text style={styles.credentialText}>Advisor:</Text>
              <Text style={styles.credentialDetail}>Email: advisor@business.com</Text>
              <Text style={styles.credentialDetail}>Password: advisor123</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    maxHeight: height * 0.9,
  },
  cartoonImage: {
    width: width * 0.9,
    height: height * 0.3,
    marginBottom: height * 0.03,
    borderRadius: 15,
  },
  title: {
    fontSize: Math.min(32, width * 0.08),
    fontWeight: 'bold',
    color: '#68BBE3',
    marginBottom: height * 0.04,
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: height * 0.08,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#0E86D4',
    fontSize: Math.min(16, width * 0.04),
    color: '#000000', // Changed to black for better visibility
  },
  loginButton: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#68BBE3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    shadowColor: "#000",
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
  },
  demoCredentials: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    width: '100%',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  credentialText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#444',
  },
  credentialDetail: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
});

export default LoginScreen;