import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const BusinessAIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateApiKey = () => {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
      throw new Error('Please configure your Groq API key');
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      validateApiKey();
      console.log('Sending request to Groq API...');

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for South African small business owners. Provide clear, practical advice that considers local business context, regulations, and market conditions.'
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
        stream: false,
        stop: null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setAnswer(data.choices[0].message.content);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Detailed error:', err);
      
      let errorMessage = 'An error occurred. ';
      if (err.message.includes('API key')) {
        errorMessage += 'Please check your API key configuration.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage += 'Please check your internet connection.';
      } else if (err.message.includes('Invalid response')) {
        errorMessage += 'Received invalid response from the server.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Business Assistant</Text>
            <Text style={styles.subtitle}>Ask any business-related question</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Type your question here..."
              value={question}
              onChangeText={setQuestion}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={askQuestion}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get Answer</Text>
              )}
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}

            {answer ? (
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>Answer:</Text>
                <Text style={styles.answerText}>{answer}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
  },
  answerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default BusinessAIAssistant;