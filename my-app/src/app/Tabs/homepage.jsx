import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Platform
} from 'react-native';
import { Link } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import CommunityPage from './community';
import ChatScreen from './chat';
import BusinessProfile from './businessprofile';


const Tab = createBottomTabNavigator();

const NavigationLink = ({ to, children, style }) => {
  const isWebLink = to.startsWith('http');
  
  if (isWebLink) {
    return (
      <TouchableOpacity 
        style={style}
        onPress={() => Linking.openURL(to)}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <Link to={to} style={style}>
      {children}
    </Link>
  );
};

const ServiceCard = ({ icon, name, href }) => (
  <Link to={href} style={styles.serviceLink}>
    <LinearGradient
      colors={['#68BBE3', '#55A8D0']}
      style={styles.serviceItem}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.serviceIconContainer}>
        <Text style={styles.serviceIcon}>{icon}</Text>
      </View>
      <Text style={styles.serviceText}>{name}</Text>
    </LinearGradient>
  </Link>
);

const CourseCard = ({ course }) => (
  <TouchableOpacity style={styles.courseItem}>
    <NavigationLink to={course.href}>
      <Image source={course.image} style={styles.courseImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.courseGradient}
      >
        <View style={styles.courseContent}>
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.courseDescription}>{course.description}</Text>
        </View>
      </LinearGradient>
    </NavigationLink>
  </TouchableOpacity>
);

const ArticleCard = ({ article }) => (
  <TouchableOpacity style={styles.articleItem}>
    <Image source={article.image} style={styles.articleImage} />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.articleGradient}
    >
      <Text style={styles.articleText}>{article.name}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const services = [
    { name: 'Banks', icon: '🏦', href: '/Tabs/Banks' },
    { name: 'Funding', icon: '💰', href: '/Tabs/funding' },
    { name: 'Business AI', icon: '🤖', href: '/Tabs/businessAi' },
    { name: 'Skills Hub', icon: '📚', href: '/Tabs/advice' },
    { name: 'Finances', icon: '📊', href: '/Tabs/BusinessFin' },
    { name: 'Cashflow', icon: '💹', href: '/Tabs/Cashflow' },
    { name: 'Invoicing', icon: '📝', href: '/Tabs/invoice' },
  ];

  const courses = [
    { 
      name: 'Free Online Business Skills', 
      image: require('../assets/standard.jpeg'), 
      description: 'Master personal and business finance management',
      href: 'https://www.standardbank.co.za/southafrica/business/bizconnect/thinkubate'
    },
  ];

  const articles = [
    { 
      name: 'First Distribution drives modernisation', 
      image: {uri: 'https://lh3.googleusercontent.com/0yqzlKFWB4U_apVffyQrEc2x2HV96UcMoa0B3N3IVp1JCLOXDlyi4pzUhSrUA6_FoHuhjfwCox5W3I6l6OkNNPrxgHWG4JvFIrBc=w904-h543-rw'},
      href: '/Tabs/Articles/first-distribution'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <LinearGradient
          colors={['#68BBE3', '#55A8D0']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Financial Hub</Text>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={20} color="#A0A0A0" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search financial services..."
              placeholderTextColor="#A0A0A0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.servicesScrollView}
          >
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Courses</Text>
          <View style={styles.coursesContainer}>
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Articles</Text>
          <View style={styles.articlesContainer}>
            {articles.map((article, index) => (
              <ArticleCard key={index} article={article} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#68BBE3',
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'Chat': iconName = 'chat'; break;
            case 'Profile': iconName = 'account'; break;
            case 'Offers': iconName = 'gift'; break;
            case 'Community': iconName = 'account-group'; break;
            default: iconName = 'circle';
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={BusinessProfile} />
      <Tab.Screen name="Community" component={CommunityPage} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 15,
    color: '#333',
  },
  servicesScrollView: {
    paddingLeft: 15,
  },
  serviceLink: {
    marginRight: 12,
    marginBottom: 10,
  },
  serviceItem: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: 110,
    height: 120,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  serviceIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 24,
  },
  serviceText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  coursesContainer: {
    paddingHorizontal: 15,
  },
  courseItem: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  courseImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  courseGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  articlesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  articleItem: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  articleImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  articleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  articleText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: 'white',
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default App;

