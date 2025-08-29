import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createThemedStyles } from '../utils/theme';
import { ThemeColors } from '../types/theme';

type ProtocolType = 'wireguard' | 'shadowsocks' | 'vless';

interface SettingsPanelProps {
  selectedProtocol: ProtocolType;
  onProtocolChange: (protocol: ProtocolType) => void;
  killSwitchEnabled: boolean;
  onKillSwitchToggle: (enabled: boolean) => void;
  dnsProtectionEnabled: boolean;
  onDnsProtectionToggle: (enabled: boolean) => void;
  autoProtocolEnabled: boolean;
  onAutoProtocolToggle: (enabled: boolean) => void;
  style?: ViewStyle;
}

const PROTOCOLS: Array<{ key: ProtocolType; label: string; description: string }> = [
  {
    key: 'wireguard',
    label: 'WireGuard',
    description: 'Fastest protocol, maximum speed',
  },
  {
    key: 'shadowsocks',
    label: 'ShadowSocks',
    description: 'Obfuscated, bypasses restrictions',
  },
  {
    key: 'vless',
    label: 'VLESS+Reality',
    description: 'Anti-detection, advanced obfuscation',
  },
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedProtocol,
  onProtocolChange,
  killSwitchEnabled,
  onKillSwitchToggle,
  dnsProtectionEnabled,
  onDnsProtectionToggle,
  autoProtocolEnabled,
  onAutoProtocolToggle,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme, createStyles);
  const [protocolModalVisible, setProtocolModalVisible] = useState(false);

  const selectedProtocolData = PROTOCOLS.find(p => p.key === selectedProtocol);

  const handleProtocolSelect = (protocol: ProtocolType) => {
    onProtocolChange(protocol);
    setProtocolModalVisible(false);
  };

  const renderProtocolItem = ({ item }: { item: typeof PROTOCOLS[0] }) => (
    <TouchableOpacity
      style={[
        styles.protocolItem,
        selectedProtocol === item.key && styles.selectedProtocolItem,
      ]}
      onPress={() => handleProtocolSelect(item.key)}
    >
      <View style={styles.protocolInfo}>
        <Text style={styles.protocolLabel}>{item.label}</Text>
        <Text style={styles.protocolDescription}>{item.description}</Text>
      </View>
      {selectedProtocol === item.key && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    disabled = false
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
          {title}
        </Text>
        <Text style={[styles.settingSubtitle, disabled && styles.disabledText]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.surfaceSecondary,
          true: theme.colors.primary,
        }}
        thumbColor={value ? theme.colors.primaryLight : theme.colors.textSecondary}
        disabled={disabled}
      />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>VPN Settings</Text>

      {/* Protocol Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Protocol</Text>
        <TouchableOpacity
          style={styles.protocolSelector}
          onPress={() => setProtocolModalVisible(true)}
        >
          <View style={styles.selectedProtocol}>
            <Text style={styles.selectedProtocolLabel}>
              {selectedProtocolData?.label}
            </Text>
            <Text style={styles.selectedProtocolDesc}>
              {selectedProtocolData?.description}
            </Text>
          </View>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Auto Protocol Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        {renderSettingItem(
          'Auto Protocol Selection',
          'Automatically choose best protocol',
          autoProtocolEnabled,
          onAutoProtocolToggle
        )}
      </View>

      {/* Security Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        {renderSettingItem(
          'Kill Switch',
          'Block internet if VPN disconnects',
          killSwitchEnabled,
          onKillSwitchToggle
        )}
        {renderSettingItem(
          'DNS Leak Protection',
          'Prevent DNS queries from leaking',
          dnsProtectionEnabled,
          onDnsProtectionToggle
        )}
      </View>

      {/* Protocol Selection Modal */}
      <Modal
        visible={protocolModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProtocolModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select VPN Protocol</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setProtocolModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={PROTOCOLS}
              keyExtractor={(item) => item.key}
              renderItem={renderProtocolItem}
              showsVerticalScrollIndicator={false}
              style={styles.protocolList}
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  protocolSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  selectedProtocol: {
    flex: 1,
  },
  selectedProtocolLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  selectedProtocolDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dropdownArrow: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  disabledText: {
    opacity: 0.5,
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
    maxHeight: '60%',
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
  protocolList: {
    maxHeight: 300,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectedProtocolItem: {
    backgroundColor: colors.primaryLight,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  protocolDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});