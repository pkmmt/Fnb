import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BusinessManagementApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cashBalance, setCashBalance] = useState(5000);
  const [dailySales, setDailySales] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Sample sales data
  const salesData = [
    { month: 'January', amount: 4000, growth: '+5%' },
    { month: 'February', amount: 3000, growth: '-25%' },
    { month: 'March', amount: 5000, growth: '+66.7%' },
    { month: 'April', amount: 4600, growth: '-8%' },
    { month: 'May', amount: 6000, growth: '+30.4%' },
    { month: 'June', amount: 5500, growth: '-8.3%' },
  ];

  // Offline Storage
  const saveDataLocally = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadDataLocally = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  };

  // Cash Alert Monitor
  useEffect(() => {
    if (cashBalance > 10000) {
      Alert.alert(
        'Cash Threshold Alert',
        'Cash balance exceeds $10,000. Consider depositing excess cash.',
        [{ text: 'OK' }]
      );
    }
  }, [cashBalance]);

  const SalesTable = ({ data }) => (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Month</Text>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Amount (R)</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Growth</Text>
      </View>
      {data.map((item, index) => (
        <View 
          key={item.month} 
          style={[
            styles.tableRow,
            index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
          ]}
        >
          <Text style={[styles.tableCell, { flex: 2 }]}>{item.month}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {item.amount.toLocaleString()}
          </Text>
          <Text 
            style={[
              styles.tableCell, 
              { flex: 1, color: item.growth.startsWith('+') ? '#28a745' : '#dc3545' }
            ]}
          >
            {item.growth}
          </Text>
        </View>
      ))}
    </View>
  );

  const DashboardScreen = () => {
    return (
      <ScrollView style={styles.container}>
        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Cash Balance</Text>
            <Text style={styles.metricValue}>R{cashBalance.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Daily Sales</Text>
            <Text style={styles.metricValue}>R{dailySales.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Monthly Growth</Text>
            <Text style={styles.metricValue}>+15%</Text>
          </View>
        </View>

        {/* Sales Table */}
        <View style={styles.salesContainer}>
          <Text style={styles.sectionTitle}>Sales Trends</Text>
          <SalesTable data={salesData} />
        </View>
      </ScrollView>
    );
  };

  const PriceCalculatorScreen = () => {
    const [cost, setCost] = useState('');
    const [margin, setMargin] = useState('30');
    const [recommendedPrice, setRecommendedPrice] = useState(0);

    const calculatePrice = () => {
      const costValue = parseFloat(cost);
      const marginValue = parseFloat(margin);
      if (isNaN(costValue) || isNaN(marginValue)) {
        Alert.alert('Invalid Input', 'Please enter valid numbers');
        return;
      }
      const price = costValue / (1 - marginValue / 100);
      setRecommendedPrice(price);
    };

    return (
      <View style={styles.calculatorContainer}>
        <Text style={styles.sectionTitle}>Price Calculator</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cost (R)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
            placeholder="Enter cost"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Margin (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={margin}
            onChangeText={setMargin}
            placeholder="Enter margin percentage"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={calculatePrice}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
        {recommendedPrice > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Recommended Price:</Text>
            <Text style={styles.resultValue}>R{recommendedPrice.toFixed(2)}</Text>
          </View>
        )}
      </View>
    );
  };

  const TransactionsScreen = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const addTransaction = () => {
      const newTransaction = {
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString(),
      };
      setTransactions([newTransaction, ...transactions]);
      saveDataLocally('transactions', [...transactions, newTransaction]);
      setAmount('');
      setDescription('');
    };

    return (
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Transactions</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.button} onPress={addTransaction}>
            <Text style={styles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {transactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Text style={styles.transactionAmount}>R{transaction.amount}</Text>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.mainContainer}>
      {activeTab === 'dashboard' && <DashboardScreen />}
      {activeTab === 'calculator' && <PriceCalculatorScreen />}
      {activeTab === 'transactions' && <TransactionsScreen />}
      
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'dashboard' && styles.activeNavItem]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'calculator' && styles.activeNavItem]}
          onPress={() => setActiveTab('calculator')}
        >
          <Text style={styles.navText}>Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'transactions' && styles.activeNavItem]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={styles.navText}>Transactions</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableRowOdd: {
    backgroundColor: '#f8f9fa',
  },
  tableCell: {
    fontSize: 14,
    color: '#212529',
  },
  salesContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculatorContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navText: {
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  transactionsContainer: {
    flex: 1,
    padding: 20,
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDescription: {
    color: '#666',
  },
});

export default BusinessManagementApp;