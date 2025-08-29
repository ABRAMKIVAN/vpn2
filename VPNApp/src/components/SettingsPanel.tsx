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

const PROTOCOLS: Array<{
  key: ProtocolType;
  label: string;
  description: string;
  speed: string;
  security: string;
  icon: string;
  recommended?: boolean;
}> = [
  {
    key: 'wireguard',
    label: 'WireGuard',
    description: 'Самый быстрый протокол для максимальной скорости',
    speed: '⚡ Максимальная',
    security: '🔒 Высокая',
    icon: '🚀',
    recommended: true,
  },
  {
    key: 'shadowsocks',
    label: 'ShadowSocks',
    description: 'Обфускация трафика, обход ограничений',
    speed: '⚡ Высокая',
    security: '🛡️ Средняя',
    icon: '🎭',
  },
  {
    key: 'vless',
    label: 'VLESS Reality',
    description: 'Продвинутая маскировка, анти-детекция',
    speed: '⚡ Средняя',
    security: '🔐 Максимальная',
    icon: '👻',
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

  const getProtocolIcon = (protocol: ProtocolType) => {
    return PROTOCOLS.find(p => p.key === protocol)?.icon || '🔧';
  };

  const renderProtocolItem = ({ item }: { item: typeof PROTOCOLS[0] }) => (
    <TouchableOpacity
      style={[
        styles.protocolItem,
        selectedProtocol === item.key && styles.selectedProtocolItem,
      ]}
      onPress={() => handleProtocolSelect(item.key)}
    >
      <View style={styles.protocolHeader}>
        <View style={styles.protocolIconContainer}>
          <Text style={styles.protocolIcon}>{item.icon}</Text>
        </View>
        <View style={styles.protocolMainInfo}>
          <View style={styles.protocolTitleRow}>
            <Text style={styles.protocolLabel}>{item.label}</Text>
            {item.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>Рекомендовано</Text>
              </View>
            )}
          </View>
          <Text style={styles.protocolDescription}>{item.description}</Text>
        </View>
        {selectedProtocol === item.key && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>

      <View style={styles.protocolStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Скорость</Text>
          <Text style={styles.statValue}>{item.speed}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Безопасность</Text>
          <Text style={styles.statValue}>{item.security}</Text>
        </View>
      </View>
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
            <Text style={styles.protocolIconSmall}>{getProtocolIcon(selectedProtocol)}</Text>
            <View style={styles.protocolTextContainer}>
              <Text style={styles.selectedProtocolLabel}>
                {selectedProtocolData?.label}
              </Text>
              <Text style={styles.selectedProtocolDesc}>
                {selectedProtocolData?.description}
              </Text>
            </View>
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
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  selectedProtocol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocolIconSmall: {
    fontSize: 20,
    marginRight: 12,
  },
  protocolTextContainer: {
    flex: 1,
  },
  selectedProtocolLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  selectedProtocolDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  dropdownArrow: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
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
    padding: 20,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceSecondary,
  },
  selectedProtocolItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  protocolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  protocolIcon: {
    fontSize: 24,
  },
  protocolMainInfo: {
    flex: 1,
  },
  protocolTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  protocolLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  recommendedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recommendedText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  protocolDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  protocolStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
});