import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StatusBar,
  Animated,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Camera, Send, ArrowLeft } from 'lucide-react';

// Components
const ProfileItem = ({ profile, onPress }) => {
  const AnimatedStatus = Animated.createAnimatedComponent(View);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (profile.status === 'online') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [profile.status]);

  return (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileAvatarContainer}>
        <Image
          source={{ uri: profile.avatar }}
          style={styles.profileAvatar}
        />
        <AnimatedStatus
          style={[
            styles.statusDot,
            profile.status === 'online' ? styles.statusOnline : styles.statusOffline,
            { transform: [{ scale: pulseAnim }] }
          ]}
        />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileTitle}>{profile.title}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {profile.lastMessage}
        </Text>
      </View>
      <View style={styles.profileMetadata}>
        <Text style={styles.lastSeen}>{profile.lastSeen}</Text>
        {profile.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{profile.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Message = ({ message, isCurrentUser }) => (
  <View style={[
    styles.messageContainer,
    isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
  ]}>
    <View style={[
      styles.messageBubble,
      isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
    ]}>
      <Text style={[
        styles.messageText,
        isCurrentUser ? styles.currentUserText : styles.otherUserText
      ]}>
        {message.text}
      </Text>
      <Text style={[
        styles.timestamp,
        isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp
      ]}>
        {message.timestamp}
      </Text>
    </View>
  </View>
);

// Screens
const ProfilesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const profiles = {
    Bob: {
      name: "Mpho",
      avatar: "https://via.placeholder.com/40",
      status: "online",
      lastSeen: "Now",
      title: "Financial Advisor",
      lastMessage: "I'm good, thanks! How about you?",
      unreadCount: 2
    },
    Emma: {
      name: "Thabza",
      avatar: "https://via.placeholder.com/40",
      status: "offline",
      lastSeen: "5m ago",
      title: "Financial Advisor",
      lastMessage: "Yes! I will be able to help you with that",
      unreadCount: 0
    },
    David: {
      name: "Nombuso",
      avatar: "https://via.placeholder.com/40",
      status: "online",
      lastSeen: "Now",
      title: "Financial Advisor",
      lastMessage: "It's scheduled for tomorrow at 2 PM",
      unreadCount: 3
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={Object.entries(profiles)}
        renderItem={({ item: [key, profile] }) => (
          <ProfileItem
            profile={profile}
            onPress={() => navigation.navigate('Chat', { profile: key, profileData: profile })}
          />
        )}
        keyExtractor={([key]) => key}
        style={styles.profilesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const ChatScreen = ({ route, navigation }) => {
  const { profileData } = route.params;
  const [messages, setMessages] = useState([
    { id: '1', text: "Hey, how are you?", sender: "Alice", timestamp: "10:00 AM" },
    { id: '2', text: profileData.lastMessage, sender: profileData.name, timestamp: "10:01 AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: String(messages.length + 1),
        text: newMessage,
        sender: "Alice",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Image
          source={{ uri: profileData.avatar }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{profileData.name}</Text>
          <Text style={styles.headerStatus}>
            {profileData.status === 'online' ? 'Active Now' : 'Last seen ' + profileData.lastSeen}
          </Text>
        </View>
      </View>
      
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Message
            message={item}
            isCurrentUser={item.sender === "Alice"}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachButton}>
          <Camera size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Message..."
          placeholderTextColor="#666"
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send size={20} color={newMessage.trim() ? "#fff" : "#A0A0A0"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Navigation
const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profiles" component={ProfilesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#f0f2f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  profilesList: {
    backgroundColor: '#fff',
  },
  profileItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  profileAvatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusOnline: {
    backgroundColor: '#34C759',
  },
  statusOffline: {
    backgroundColor: '#9e9e9e',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profileTitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileMetadata: {
    alignItems: 'flex-end',
  },
  lastSeen: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerStatus: {
    fontSize: 13,
    color: '#666',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#f0f2f5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f2f5',
  },
});

export default App;