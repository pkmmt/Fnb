import React, { useState, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const CREDENTIALS = {
  BUSINESS_OWNER: {
    email: 'owner@business.com',
    password: 'owner123',
    role: 'owner'
  }
};

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      //  API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email === CREDENTIALS.BUSINESS_OWNER.email && 
          formData.password === CREDENTIALS.BUSINESS_OWNER.password) {
        router.replace('/Tabs/homepage');
        return;
      }
      
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = useCallback(({ field, placeholder, isPassword = false }) => (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          keyboardType={field === 'email' ? 'email-address' : 'default'}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#68BBE3"
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  ), [formData, errors, showPassword, handleInputChange]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F4F8', '#FFFFFF', '#E8F4F8']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.innerContainer}>
            <Image
              source={require('./assets/brain.jpg')}
              style={styles.cartoonImage}
              resizeMode="cover"
            />
            <Text style={styles.title}>Finance App</Text>
            
            {renderInput({ field: 'email', placeholder: 'Email' })}
            {renderInput({ field: 'password', placeholder: 'Password', isPassword: true })}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            {__DEV__ && (
              <View style={styles.demoCredentials}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.credentialText}>Business Owner:</Text>
                <Text style={styles.credentialDetail}>Email: owner@business.com</Text>
                <Text style={styles.credentialDetail}>Password: owner123</Text>
              </View>
            )}
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
    width: width * 0.8,
    height: height * 0.25,
    marginBottom: height * 0.04,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: Math.min(36, width * 0.09),
    fontWeight: '800',
    color: '#0E86D4',
    marginBottom: height * 0.05,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#68BBE3',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  input: {
    flex: 1,
    height: height * 0.07,
    paddingHorizontal: 20,
    fontSize: Math.min(16, width * 0.04),
    color: '#333333',
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  loginButton: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#0E86D4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: Math.min(18, width * 0.045),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  demoCredentials: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(104, 187, 227, 0.1)',
    borderRadius: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#68BBE3',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0E86D4',
  },
  credentialText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    color: '#333333',
  },
  credentialDetail: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 10,
    marginTop: 2,
  },
});

export default LoginScreen;