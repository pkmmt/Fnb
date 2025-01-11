import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';

const CashflowCalculator = () => {
  const [incomeItems, setIncomeItems] = useState([{ description: '', amount: '' }]);
  const [expenseItems, setExpenseItems] = useState([{ description: '', amount: '' }]);
  const [showTips, setShowTips] = useState(false);
  const [showStatement, setShowStatement] = useState(false);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const addItem = (type) => {
    if (type === 'income') {
      setIncomeItems([...incomeItems, { description: '', amount: '' }]);
    } else {
      setExpenseItems([...expenseItems, { description: '', amount: '' }]);
    }
  };

  const updateItem = (type, index, field, value) => {
    if (type === 'income') {
      const newItems = [...incomeItems];
      newItems[index] = { ...newItems[index], [field]: value };
      setIncomeItems(newItems);
    } else {
      const newItems = [...expenseItems];
      newItems[index] = { ...newItems[index], [field]: value };
      setExpenseItems(newItems);
    }
  };

  const totalIncome = calculateTotal(incomeItems);
  const totalExpenses = calculateTotal(expenseItems);
  const netCashflow = totalIncome - totalExpenses;

  const generateStatement = () => {
    const date = new Date().toLocaleDateString();
    const cashflowRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    
    let healthStatus = '';
    if (cashflowRatio < 50) {
      healthStatus = 'Excellent';
    } else if (cashflowRatio < 70) {
      healthStatus = 'Good';
    } else if (cashflowRatio < 90) {
      healthStatus = 'Fair';
    } else {
      healthStatus = 'Poor';
    }

    let recommendations = [];
    if (netCashflow < 0) {
      recommendations.push('⚠️ Immediate action required to reduce expenses or increase income');
      recommendations.push('📉 Consider cutting non-essential expenses');
      recommendations.push('💡 Look for additional income sources');
    } else if (cashflowRatio > 70) {
      recommendations.push('⚠️ Expense ratio is high, consider cost reduction strategies');
      recommendations.push('📊 Review major expense categories for potential savings');
    }
    if (totalIncome === 0) {
      recommendations.push('❗ No income recorded. Please add income sources');
    }

    const topExpenses = expenseItems
      .filter(item => item.description && item.amount)
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 3);

    return {
      date,
      summary: {
        totalIncome,
        totalExpenses,
        netCashflow,
        cashflowRatio: cashflowRatio.toFixed(1),
        healthStatus,
      },
      topExpenses,
      recommendations,
    };
  };

  const shareStatement = async () => {
    const statement = generateStatement();
    const shareMessage = `
Cashflow Statement - ${statement.date}

Summary:
• Total Income: R${statement.summary.totalIncome.toFixed(2)}
• Total Expenses: R${statement.summary.totalExpenses.toFixed(2)}
• Net Cashflow: R${statement.summary.netCashflow.toFixed(2)}
• Expense Ratio: ${statement.summary.cashflowRatio}%
• Financial Health Status: ${statement.summary.healthStatus}

${statement.topExpenses.length > 0 ? `
Top Expenses:
${statement.topExpenses.map(expense => 
  `• ${expense.description}: R${parseFloat(expense.amount).toFixed(2)}`
).join('\n')}` : ''}

Recommendations:
${statement.recommendations.join('\n')}
    `;

    try {
      await Share.share({
        message: shareMessage,
        title: 'Cashflow Statement',
      });
    } catch (error) {
      console.error(error);
    }
  };
  const StatementView = () => {
    const statement = generateStatement();
    
    return (
      <View style={styles.statementSection}>
        <Text style={styles.statementTitle}>Cashflow Statement</Text>
        <Text style={styles.statementDate}>{statement.date}</Text>
        
        <View style={styles.statementSummary}>
          <Text style={styles.statementSubtitle}>Summary</Text>
          <Text style={styles.statementText}>Total Income: R {statement.summary.totalIncome.toFixed(2)}</Text>
          <Text style={styles.statementText}>Total Expenses: R{statement.summary.totalExpenses.toFixed(2)}</Text>
          <Text style={styles.statementText}>Net Cashflow: R{statement.summary.netCashflow.toFixed(2)}</Text>
          <Text style={styles.statementText}>Expense Ratio: {statement.summary.cashflowRatio}%</Text>
          <Text style={[styles.statementText, styles.healthStatus]}>
            Financial Health Status: {statement.summary.healthStatus}
          </Text>
        </View>

        {statement.topExpenses.length > 0 && (
          <View style={styles.topExpenses}>
            <Text style={styles.statementSubtitle}>Top Expenses</Text>
            {statement.topExpenses.map((expense, index) => (
              <Text key={index} style={styles.statementText}>
                • {expense.description}: R{parseFloat(expense.amount).toFixed(2)}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.recommendations}>
          <Text style={styles.statementSubtitle}>Recommendations</Text>
          {statement.recommendations.map((recommendation, index) => (
            <Text key={index} style={styles.recommendationText}>
              {recommendation}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareStatement}
        >
          <Text style={styles.shareButtonText}>Share Statement</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cashflow Calculator</Text>

      {/* Income Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income Sources</Text>
        {incomeItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              value={item.description}
              onChangeText={(text) => updateItem('income', index, 'description', text)}
            />
            <TextInput
              style={styles.amountInput}
              placeholder="Amount"
              keyboardType="numeric"
              value={item.amount}
              onChangeText={(text) => updateItem('income', index, 'amount', text)}
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addItem('income')}
        >
          <Text style={styles.addButtonText}>+ Add Income</Text>
        </TouchableOpacity>
      </View>

      {/* Expenses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        {expenseItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Description"
              value={item.description}
              onChangeText={(text) => updateItem('expense', index, 'description', text)}
            />
            <TextInput
              style={styles.amountInput}
              placeholder="Amount"
              keyboardType="numeric"
              value={item.amount}
              onChangeText={(text) => updateItem('expense', index, 'amount', text)}
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addItem('expense')}
        >
          <Text style={styles.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>Total Income: R{totalIncome.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Expenses: R{totalExpenses.toFixed(2)}</Text>
        <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>
          Net Cashflow: R{netCashflow.toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => setShowStatement(!showStatement)}
      >
        <Text style={styles.generateButtonText}>
          {showStatement ? 'Hide Statement' : 'Generate Statement'}
        </Text>
      </TouchableOpacity>

      {/* Display Statement */}

      {showStatement && <StatementView />}
      {/* Tips Section */}
      <TouchableOpacity
        style={styles.tipsButton}
        onPress={() => setShowTips(!showTips)}
      >
        <Text style={styles.tipsButtonText}>
          {showTips ? 'Hide Tips' : 'Show Cashflow Tips'}
        </Text>
      </TouchableOpacity>

      {showTips && (
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips to Improve Cashflow:</Text>
          {cashflowTips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>
              • {tip}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  descriptionInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  summarySection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
  },
  tipsButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tipsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  
  statementSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  statementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statementDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statementSummary: {
    marginBottom: 16,
  },
  statementSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statementText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  healthStatus: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  topExpenses: {
    marginBottom: 16,
  },
  recommendations: {
    marginBottom: 16,
  },
  recommendationText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  generateButton: {
    backgroundColor: '#5856D6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CashflowCalculator;