import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../utils/theme';
import { ThemeColors } from '../types/theme';

interface Server {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  speed: number;
  ping: number;
  load: number;
}

interface CountrySelectorProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
  servers: Server[];
  style?: ViewStyle;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountrySelect,
  servers,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);
  const [modalVisible, setModalVisible] = useState(false);

  // Get unique countries from servers
  const countries = servers.reduce((acc, server) => {
    if (!acc.find(c => c.countryCode === server.countryCode)) {
      acc.push({
        countryCode: server.countryCode,
        country: server.country,
        city: server.city,
        speed: server.speed,
        ping: server.ping,
        load: server.load,
      });
    }
    return acc;
  }, [] as Array<Pick<Server, 'countryCode' | 'country' | 'city' | 'speed' | 'ping' | 'load'>>);

  const selectedCountryData = countries.find(c => c.countryCode === selectedCountry) || countries[0];

  const handleCountrySelect = (countryCode: string) => {
    onCountrySelect(countryCode);
    setModalVisible(false);
  };

  const renderCountryItem = ({ item }: { item: typeof countries[0] }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        selectedCountry === item.countryCode && styles.selectedCountryItem,
      ]}
      onPress={() => handleCountrySelect(item.countryCode)}
    >
      <View style={styles.countryInfo}>
        <View style={styles.flagPlaceholder}>
          <Text style={styles.flagText}>{item.countryCode}</Text>
        </View>
        <View style={styles.countryDetails}>
          <Text style={styles.countryName}>{item.country}</Text>
          <Text style={styles.cityName}>{item.city}</Text>
        </View>
      </View>

      <View style={styles.serverStats}>
        <Text style={styles.speedText}>{item.speed} Mbps</Text>
        <Text style={styles.pingText}>{item.ping}ms</Text>
        <View style={[styles.loadIndicator, { backgroundColor: getLoadColor(item.load) }]} />
      </View>
    </TouchableOpacity>
  );

  const getLoadColor = (load: number) => {
    if (load < 30) return theme.colors.success;
    if (load < 70) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Select Location</Text>

      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectedCountry}>
          <View style={styles.flagPlaceholder}>
            <Text style={styles.flagText}>{selectedCountryData.countryCode}</Text>
          </View>
          <View style={styles.selectedCountryDetails}>
            <Text style={styles.selectedCountryName}>{selectedCountryData.country}</Text>
            <Text style={styles.selectedCityName}>{selectedCountryData.city}</Text>
          </View>
          <Text style={styles.dropdownArrow}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Server Location</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={countries}
              keyExtractor={(item) => item.countryCode}
              renderItem={renderCountryItem}
              showsVerticalScrollIndicator={false}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  selectorButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  selectedCountry: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  flagPlaceholder: {
    width: 40,
    height: 30,
    borderRadius: 4,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  flagText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedCountryDetails: {
    flex: 1,
  },
  selectedCountryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  selectedCityName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dropdownArrow: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
  },
  countryList: {
    maxHeight: 300,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectedCountryItem: {
    backgroundColor: colors.primaryLight,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryDetails: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cityName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  serverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speedText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  pingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});