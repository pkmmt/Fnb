import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const InvoiceForm = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: ''
  });

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => 
      sum + (Number(item.quantity) * Number(item.rate)), 0
    );
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.15; 
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.clientName || !formData.clientEmail || !formData.invoiceNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const invoice = {
      ...formData,
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      total: calculateSubtotal() + calculateVAT(),
      generatedDate: new Date().toLocaleDateString()
    };

    // save the invoice or send it to a server
    Alert.alert(
      'Success',
      'Invoice generated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            onClose();
            // Reset form
            setFormData({
              clientName: '',
              clientEmail: '',
              clientAddress: '',
              invoiceNumber: '',
              issueDate: '',
              dueDate: '',
              items: [{ description: '', quantity: 1, rate: 0 }],
              notes: ''
            });
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create New Invoice</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.clientName}
              onChangeText={(value) => handleInputChange('clientName', value)}
              placeholder="Enter client name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.clientEmail}
              onChangeText={(value) => handleInputChange('clientEmail', value)}
              placeholder="Enter client email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Address</Text>
            <TextInput
              style={styles.input}
              value={formData.clientAddress}
              onChangeText={(value) => handleInputChange('clientAddress', value)}
              placeholder="Enter client address"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Invoice Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.invoiceNumber}
              onChangeText={(value) => handleInputChange('invoiceNumber', value)}
              placeholder="Enter invoice number"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Issue Date</Text>
            <TextInput
              style={styles.input}
              value={formData.issueDate}
              onChangeText={(value) => handleInputChange('issueDate', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TextInput
              style={styles.input}
              value={formData.dueDate}
              onChangeText={(value) => handleInputChange('dueDate', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.itemsSection}>
            <Text style={styles.label}>Items</Text>
            {formData.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  value={item.description}
                  onChangeText={(value) => handleItemChange(index, 'description', value)}
                  placeholder="Description"
                />
                <TextInput
                  style={[styles.input, styles.quantityInput]}
                  value={String(item.quantity)}
                  onChangeText={(value) => handleItemChange(index, 'quantity', value)}
                  keyboardType="numeric"
                  placeholder="Qty"
                />
                <TextInput
                  style={[styles.input, styles.rateInput]}
                  value={String(item.rate)}
                  onChangeText={(value) => handleItemChange(index, 'rate', value)}
                  keyboardType="numeric"
                  placeholder="Rate"
                />
                <TouchableOpacity
                  onPress={() => removeItem(index)}
                  style={styles.removeButton}
                >
                  <Icon name="trash-2" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={addItem} style={styles.addButton}>
              <Icon name="plus" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>R {calculateSubtotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>VAT (15%):</Text>
              <Text style={styles.summaryValue}>R {calculateVAT().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>R {(calculateSubtotal() + calculateVAT()).toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Generate Invoice</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

// Update the InvoiceTools 
const InvoiceTools = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.alert}>
        <Icon name="alert-circle" size={20} color="#2563eb" />
        <Text style={styles.alertTitle}>Automated Invoice Management</Text>
        <Text style={styles.alertDescription}>
          Streamline your invoicing process with our automated tools
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="file-text" size={20} color="#333" />
            <Text style={styles.cardTitle}>Invoice Generation</Text>
          </View>
          <View style={styles.cardContent}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.buttonText}>Create New Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>View Invoice Templates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <InvoiceForm
        visible={showForm}
        onClose={() => setShowForm(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  itemsSection: {
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  descriptionInput: {
    flex: 2,
  },
  quantityInput: {
    flex: 0.5,
  },
  rateInput: {
    flex: 1,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Existing styles from the original component
  section: {
    paddingBottom: 16,
  },
  alert: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginVertical: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#3b82f6',
  },
  grid: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  cardContent: {
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
});

export default InvoiceTools;