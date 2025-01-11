import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BankInfo = ({ name, benefits, loans }) => (
  <View style={styles.bankContainer}>
    <LinearGradient
      colors={['#ffffff', '#f8f9ff']}
      style={styles.gradientBackground}
    >
      <View style={styles.bankHeader}>
        <Text style={styles.bankName}>{name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Key Benefits</Text>
          <View style={styles.sectionIcon}>
            <Text>✨</Text>
          </View>
        </View>
        <View style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Text style={styles.benefitIconText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Loans</Text>
          <View style={styles.sectionIcon}>
            <Text>💰</Text>
          </View>
        </View>
        <View style={styles.loansGrid}>
          {loans.map((loan, index) => (
            <View key={index} style={styles.loanItem}>
              <Text style={styles.loanText}>{loan}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

const SASmallBusinessBankingPage = () => {
  const [selectedBank, setSelectedBank] = useState(null);

  const banks = [
    {
      name: "Standard Bank",
      benefits: [
        "Free business banking for 12 months",
        "Online banking platform",
        "Business credit card",
        "Dedicated business banker"
      ],
      loans: [
        "Term loans",
        "Overdraft facilities",
        "Asset finance",
        "Commercial property finance"
      ]
    },
    {
      name: "FNB",
      benefits: [
        "eBucks rewards program",
        "Free accounting software integration",
        "Business insurance solutions",
        "Forex services"
      ],
      loans: [
        "Business term loans",
        "Revolving credit facility",
        "Vehicle and asset finance",
        "BEE funding"
      ]
    },
    {
      name: "Nedbank",
      benefits: [
        "Startup bundle for new businesses",
        "Free business registration services",
        "Cashflow management tools",
        "Networking events"
      ],
      loans: [
        "Working capital loans",
        "Equipment finance",
        "Franchise financing",
        "Green energy solutions funding"
      ]
    },
    {
      name: "Absa",
      benefits: [
        "Business Evolve offering for SMEs",
        "Digital payment solutions",
        "Trade finance services",
        "Enterprise development programs"
      ],
      loans: [
        "Business development loans",
        "Invoice discounting",
        "Agri business loans",
        "Commercial property finance"
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Business Banking</Text>
        <Text style={styles.subtitle}>Compare top banks in South Africa</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.bankButtonsScroll}
      >
        <View style={styles.bankButtonsContainer}>
          {banks.map((bank, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.bankButton,
                selectedBank === bank.name && styles.selectedBankButton
              ]}
              onPress={() => setSelectedBank(bank.name)}
            >
              <Text 
                style={[
                  styles.bankButtonText,
                  selectedBank === bank.name && styles.selectedBankButtonText
                ]}
              >
                {bank.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedBank && (
        <BankInfo {...banks.find(bank => bank.name === selectedBank)} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bankButtonsScroll: {
    marginVertical: 20,
  },
  bankButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  bankButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  selectedBankButton: {
    backgroundColor: '#2563EB',
  },
  bankButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 15,
  },
  selectedBankButtonText: {
    color: '#fff',
  },
  bankContainer: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: 20,
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginRight: 10,
  },
  sectionIcon: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 6,
  },
  benefitsGrid: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  benefitIcon: {
    backgroundColor: '#2563EB',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitIconText: {
    color: '#fff',
    fontSize: 16,
  },
  benefitText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  loansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  loanItem: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loanText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SASmallBusinessBankingPage;