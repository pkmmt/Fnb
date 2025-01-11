import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  Modal
} from 'react-native';

const FundingMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState(null);

  // Sample funding opportunities data
  const fundingOpportunities = [
    {
      id: 1,
      title: "SEFA Small Business Funding",
      type: "Government",
      amount: "R50k - R5M",
      deadline: "2024-12-31",
      category: "Government",
      description: "The Small Enterprise Finance Agency (SEFA) provides financial support to SMEs and cooperatives.",
      requirements: [
        "Valid South African ID",
        "Business registration documents",
        "Tax clearance certificate",
        "Business plan",
        "Financial statements/projections"
      ],
      applicationProcess: "Online application through SEFA portal",
      sector: "All sectors",
      status: "Open"
    },
    {
      id: 2,
      title: "Technology Innovation Fund",
      type: "Private",
      amount: "Up to R2M",
      deadline: "2024-11-30",
      category: "Private",
      description: "Investment funding for technology-based startups and small businesses.",
      requirements: [
        "Tech-focused business",
        "Proof of concept",
        "Company registration",
        "Pitch deck",
        "MVP demonstration"
      ],
      applicationProcess: "Direct application with investor pitch",
      sector: "Technology",
      status: "Open"
    },
    {
      id: 3,
      title: "Black Business Supplier Development",
      type: "Government",
      amount: "Up to R1M",
      deadline: "2024-10-15",
      category: "Government",
      description: "Support program for black-owned businesses to improve their competitiveness.",
      requirements: [
        "51% black ownership",
        "Trading history > 1 year",
        "Valid BEE certificate",
        "Business registration",
        "Tax compliance"
      ],
      applicationProcess: "Through DTI website",
      sector: "Manufacturing, Services",
      status: "Open"
    },
    {
      id: 4,
      title: "Agricultural Development Grant",
      type: "Grant",
      amount: "R250k - R500k",
      deadline: "2024-09-30",
      category: "Grant",
      description: "Support for small-scale farmers and agricultural businesses.",
      requirements: [
        "Agricultural business registration",
        "Land ownership/lease agreement",
        "Business plan",
        "Environmental impact assessment",
        "Previous farming experience"
      ],
      applicationProcess: "Provincial agriculture office submission",
      sector: "Agriculture",
      status: "Open"
    }
  ];

  const categories = ['All', 'Government', 'Private', 'Grant'];

  const filteredOpportunities = fundingOpportunities.filter(opportunity => {
    const matchesCategory = selectedCategory === 'All' || opportunity.category === selectedCategory;
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpportunityPress = (opportunity) => {
    setSelectedFunding(opportunity);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Funding Marketplace</Text>
        <Text style={styles.headerSubtitle}>Discover Financial Opportunities for Your Business</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search funding opportunities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.opportunitiesContainer}>
        {filteredOpportunities.map((opportunity) => (
          <TouchableOpacity
            key={opportunity.id}
            style={styles.opportunityCard}
            onPress={() => handleOpportunityPress(opportunity)}
          >
            <View style={styles.opportunityHeader}>
              <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{opportunity.type}</Text>
              </View>
            </View>
            <Text style={styles.amount}>Amount: {opportunity.amount}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {opportunity.description}
            </Text>
            <View style={styles.footerContainer}>
              <Text style={styles.deadline}>Deadline: {opportunity.deadline}</Text>
              <Text style={styles.sector}>{opportunity.sector}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {selectedFunding && (
              <ScrollView>
                <Text style={styles.modalTitle}>{selectedFunding.title}</Text>
                <View style={styles.modalTagContainer}>
                  <Text style={styles.modalTag}>{selectedFunding.type}</Text>
                  <Text style={styles.modalTag}>{selectedFunding.sector}</Text>
                </View>
                
                <Text style={styles.modalSubtitle}>Description</Text>
                <Text style={styles.modalText}>{selectedFunding.description}</Text>
                
                <Text style={styles.modalSubtitle}>Amount Available</Text>
                <Text style={styles.modalText}>{selectedFunding.amount}</Text>
                
                <Text style={styles.modalSubtitle}>Requirements</Text>
                {selectedFunding.requirements.map((requirement, index) => (
                  <Text key={index} style={styles.bulletPoint}>• {requirement}</Text>
                ))}
                
                <Text style={styles.modalSubtitle}>Application Process</Text>
                <Text style={styles.modalText}>{selectedFunding.applicationProcess}</Text>
                
                <Text style={styles.modalSubtitle}>Deadline</Text>
                <Text style={styles.modalText}>{selectedFunding.deadline}</Text>

                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#68BBE3',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 25,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategory: {
    backgroundColor: '#68BBE3',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  opportunitiesContainer: {
    padding: 15,
  },
  opportunityCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  opportunityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  tagContainer: {
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tag: {
    color: '#68BBE3',
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: '#666',
  },
  sector: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginRight: 40,
  },
  modalTagContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalTag: {
    backgroundColor: '#E8F4F8',
    color: '#68BBE3',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    fontSize: 14,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    marginBottom: 5,
  },
  applyButton: {
    backgroundColor: '#68BBE3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FundingMarketplace;