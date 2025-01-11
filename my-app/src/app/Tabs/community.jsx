import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Constants
const TABS = {
  DISCUSSIONS: 'discussions',
  OPPORTUNITIES: 'opportunities',
};

const DISCUSSIONS = [
  {
    id: '1',
    title: 'Tips for Small Business Marketing',
    author: 'Alex Nkosi',
    avatar: 'AN',
    replies: 23,
    tags: ['Marketing', 'Small Business'],
    timestamp: '2h ago',
    likes: 15,
  },
  {
    id: '2',
    title: 'Looking for Partnership in Tech Industry',
    author: 'Jessica Leena',
    avatar: 'JL',
    replies: 15,
    tags: ['Technology', 'Partnership'],
    timestamp: '4h ago',
    likes: 8,
  },
];

const OPPORTUNITIES = [
  {
    id: '1',
    title: 'Business Stokvel',
    description: 'Looking for partners to create a business stokvel to alleviate costs',
    postedBy: 'Mbali Nkosi',
    type: 'Joint Venture',
    timestamp: '1d ago',
    interested: 12,
  },
  {
    id: '2',
    title: 'Restaurant Business Mentor',
    description: 'Seeking experienced restaurant owner for guidance',
    postedBy: 'Pete N',
    type: 'Mentorship',
    timestamp: '2d ago',
    interested: 5,
  },
];

// Components
const Avatar = ({ initials, size = 40 }) => (
  <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={styles.avatarText}>{initials}</Text>
  </View>
);

const TabButton = ({ title, active, icon, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.activeTabButton]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Icon name={icon} size={20} color={active ? '#007AFF' : '#666'} />
    <Text style={[styles.tabButtonText, active && styles.activeTabButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const Badge = ({ text, variant = 'primary' }) => (
  <View style={[styles.badge, variant === 'outline' && styles.outlineBadge]}>
    <Text style={[styles.badgeText, variant === 'outline' && styles.outlineBadgeText]}>
      {text}
    </Text>
  </View>
);

const DiscussionCard = ({ item }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <View style={styles.cardHeader}>
      <View style={styles.authorContainer}>
        <Avatar initials={item.avatar} size={36} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more-horizontal" size={20} color="#666" />
      </TouchableOpacity>
    </View>
    
    <Text style={styles.discussionTitle}>{item.title}</Text>
    
    <View style={styles.tagsContainer}>
      {item.tags.map((tag) => (
        <Badge key={tag} text={tag} variant="outline" />
      ))}
    </View>
    
    <View style={styles.cardFooter}>
      <View style={styles.footerItem}>
        <Icon name="message-circle" size={16} color="#666" />
        <Text style={styles.footerText}>{item.replies}</Text>
      </View>
      <View style={styles.footerItem}>
        <Icon name="heart" size={16} color="#666" />
        <Text style={styles.footerText}>{item.likes}</Text>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join Discussion</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const OpportunityCard = ({ item }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <View style={styles.cardHeader}>
      <View style={styles.opportunityHeaderContent}>
        <Badge text={item.type} />
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
    
    <Text style={styles.opportunityTitle}>{item.title}</Text>
    <Text style={styles.description}>{item.description}</Text>
    
    <View style={styles.opportunityFooter}>
      <View style={styles.postedByContainer}>
        <Text style={styles.postedByText}>Posted by </Text>
        <Text style={styles.postedByName}>{item.postedBy}</Text>
      </View>
      <View style={styles.interestedContainer}>
        <Icon name="users" size={16} color="#666" />
        <Text style={styles.interestedText}>{item.interested} interested</Text>
      </View>
    </View>
    
    <TouchableOpacity style={styles.learnMoreButton}>
      <Text style={styles.learnMoreButtonText}>Learn More</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const SearchBar = ({ value, onChangeText }) => (
  <View style={styles.searchContainer}>
    <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Search discussions and opportunities..."
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const CommunityPage = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(TABS.DISCUSSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <View style={styles.tabContainer}>
        <TabButton
          title="Discussions"
          icon="message-circle"
          active={activeTab === TABS.DISCUSSIONS}
          onPress={() => setActiveTab(TABS.DISCUSSIONS)}
        />
        <TabButton
          title="Opportunities"
          icon="briefcase"
          active={activeTab === TABS.OPPORTUNITIES}
          onPress={() => setActiveTab(TABS.OPPORTUNITIES)}
        />
      </View>

      <FlatList
        data={activeTab === TABS.DISCUSSIONS ? DISCUSSIONS : OPPORTUNITIES}
        renderItem={({ item }) =>
          activeTab === TABS.DISCUSSIONS ? (
            <DiscussionCard item={item} />
          ) : (
            <OpportunityCard item={item} />
          )
        }
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activeTabButton: {
    backgroundColor: '#EBF5FF',
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#007AFF',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  discussionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  outlineBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  outlineBadgeText: {
    color: '#007AFF',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  opportunityHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  opportunityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedByText: {
    fontSize: 14,
    color: '#666',
  },
  postedByName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  interestedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestedText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  learnMoreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  learnMoreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  refreshText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  chipCloseButton: {
    padding: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginTop: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CommunityPage;