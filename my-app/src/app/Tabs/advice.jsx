import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import * as Progress from 'react-native-progress';

// Constants
const LEVEL_UP_THRESHOLD = 100;
const BADGE_BONUS_POINTS = 50;


const Theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    background: '#f3f4f6',
    card: '#ffffff',
    text: '#1f2937',
    textLight: '#6b7280',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    highlight: '#3b82f6'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
  }
};

// Header Component
const Header = ({ points, level, streak }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>Business Skills Hub</Text>
      <View style={styles.streakBadge}>
        <Text style={styles.streakText}>🔥 {streak} Day Streak</Text>
      </View>
    </View>
    <View style={styles.statsContainer}>
      <Text style={styles.pointsText}>{points} Points</Text>
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Progress.Bar 
          progress={(points % LEVEL_UP_THRESHOLD) / LEVEL_UP_THRESHOLD}
          width={100}
          color={Theme.colors.highlight}
          unfilledColor={Theme.colors.background}
          borderWidth={0}
          height={6}
        />
      </View>
    </View>
  </View>
);

// Module Card Component
const ModuleCard = ({ module, isCompleted, isLocked, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLocked}
      activeOpacity={0.7}
    >
      <Animated.View style={[
        styles.moduleCard,
        isCompleted && styles.completedCard,
        isLocked && styles.lockedCard,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={styles.moduleHeader}>
          <Text style={styles.moduleIcon}>{module.icon}</Text>
          <View style={styles.moduleTitleContainer}>
            <Text style={styles.moduleTitle}>{module.title}</Text>
            {isLocked && (
              <Text style={styles.lockText}>
                Unlock at level {module.requiredLevel}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.progressIndicator}>
          <Progress.Circle 
            size={30}
            progress={isCompleted ? 1 : 0}
            color={Theme.colors.success}
            unfilledColor={Theme.colors.background}
            borderWidth={0}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

//  Hook for Game State
const useGameState = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [lastCompletedDate, setLastCompletedDate] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const newLevel = Math.floor(userPoints / LEVEL_UP_THRESHOLD) + 1;
    if (newLevel !== userLevel) {
      setUserLevel(newLevel);
    }
  }, [userPoints]);

  const updateStreak = () => {
    if (lastCompletedDate) {
      const lastDate = new Date(lastCompletedDate);
      const today = new Date();
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        setStreak(prev => prev + 1);
      } else if (diffDays > 1) {
        setStreak(0);
      }
    }
    setLastCompletedDate(new Date());
  };

  const completeModule = (moduleId) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules(prev => [...prev, moduleId]);
      setUserPoints(prev => prev + 20);
      updateStreak();
    }
  };

  return {
    userPoints,
    userLevel,
    streak,
    completedModules,
    completeModule,
    setUserPoints
  };
};

// Main Component
const BusinessEducationGame = () => {
  const {
    userPoints,
    userLevel,
    streak,
    completedModules,
    completeModule
  } = useGameState();

  const [currentModule, setCurrentModule] = useState(null);

  
  const educationalModules = [
    {
      id: 1,
      title: 'Financial Basics',
      icon: '💰',
      requiredLevel: 1
    },
    {
      id: 2,
      title: 'Tax Compliance',
      icon: '📊',
      requiredLevel: 2
    },
    {
      id: 3,
      title: 'BEE Certification',
      icon: '🏆',
      requiredLevel: 3
    },
    {
      id: 4,
      title: 'Business Planning',
      icon: '📈',
      requiredLevel: 1
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Theme.colors.primary} />
      <Header 
        points={userPoints}
        level={userLevel}
        streak={streak}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {educationalModules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            isCompleted={completedModules.includes(module.id)}
            isLocked={userLevel < module.requiredLevel}
            onPress={() => {
              if (userLevel >= module.requiredLevel) {
                setCurrentModule(module);
                completeModule(module.id);
              }
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.card,
  },
  streakBadge: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.md,
  },
  streakText: {
    color: Theme.colors.card,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsText: {
    color: Theme.colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelContainer: {
    alignItems: 'flex-end',
  },
  levelText: {
    color: Theme.colors.card,
    marginBottom: Theme.spacing.xs,
  },
  moduleCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    backgroundColor: Theme.colors.success + '10',
    borderColor: Theme.colors.success,
    borderWidth: 1,
  },
  lockedCard: {
    opacity: 0.5,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moduleIcon: {
    fontSize: 24,
    marginRight: Theme.spacing.md,
  },
  moduleTitleContainer: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  lockText: {
    fontSize: 12,
    color: Theme.colors.error,
    marginTop: Theme.spacing.xs,
  },
  progressIndicator: {
    marginLeft: Theme.spacing.md,
  }
});

export default BusinessEducationGame;