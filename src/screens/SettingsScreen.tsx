import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import NeomorphCard from '../components/NeomorphCard';
import NeomorphButton from '../components/NeomorphButton';
import { VPNProtocol } from '../types';
import { VPN_PROTOCOLS } from '../constants';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, updateUserSettings } = useAuth();
  const [selectedProtocol, setSelectedProtocol] = useState<VPNProtocol>(
    user?.settings.protocol || 'wireguard'
  );

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error[500] }]}>
          Ошибка загрузки пользователя
        </Text>
      </SafeAreaView>
    );
  }

  const handleToggleSetting = async (setting: keyof typeof user.settings, value: any) => {
    await updateUserSettings({ [setting]: value });
  };

  const handleProtocolChange = async (protocol: VPNProtocol) => {
    setSelectedProtocol(protocol);
    await updateUserSettings({ protocol });
  };

  const showUpgradeAlert = () => {
    Alert.alert(
      'Премиум функция',
      'Эта функция доступна только для премиум пользователей',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Обновиться', onPress: () => console.log('Upgrade to premium') },
      ]
    );
  };

  const renderSettingRow = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    premium: boolean = false
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Icon name={icon} size={24} color={colors.primary[500]} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {title}
            {premium && !user.isPremium && (
              <Icon name="crown" size={14} color={colors.warning[500]} style={{ marginLeft: 8 }} />
            )}
          </Text>
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      
      <Switch
        value={value}
        onValueChange={premium && !user.isPremium ? showUpgradeAlert : onToggle}
        trackColor={{
          false: colors.border,
          true: colors.primary[500],
        }}
        thumbColor={value ? '#ffffff' : colors.textSecondary}
        disabled={premium && !user.isPremium}
        style={{ opacity: premium && !user.isPremium ? 0.5 : 1 }}
      />
    </View>
  );

  const renderProtocolCard = (protocol: VPNProtocol) => {
    const protocolInfo = VPN_PROTOCOLS[protocol.toUpperCase().replace('-', '_') as keyof typeof VPN_PROTOCOLS];
    const isSelected = selectedProtocol === protocol;

    return (
      <TouchableOpacity
        key={protocol}
        style={[
          styles.protocolCard,
          {
            backgroundColor: isSelected ? colors.primary[500] : colors.surface,
            borderColor: isSelected ? colors.primary[500] : colors.border,
          }
        ]}
        onPress={() => handleProtocolChange(protocol)}
      >
        <Icon
          name={protocolInfo.icon}
          size={32}
          color={isSelected ? '#ffffff' : colors.primary[500]}
        />
        
        <Text
          style={[
            styles.protocolName,
            { color: isSelected ? '#ffffff' : colors.text }
          ]}
        >
          {protocolInfo.name}
        </Text>
        
        <Text
          style={[
            styles.protocolDescription,
            { color: isSelected ? '#ffffff' : colors.textSecondary }
          ]}
        >
          {protocolInfo.description}
        </Text>
        
        <View style={styles.protocolFeatures}>
          {protocolInfo.features.map((feature, index) => (
            <Text
              key={index}
              style={[
                styles.protocolFeature,
                { color: isSelected ? '#ffffff' : colors.textSecondary }
              ]}
            >
              • {feature}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Настройки
          </Text>
        </View>

        {/* Основные настройки */}
        <NeomorphCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Основные настройки
          </Text>
          
          {renderSettingRow(
            'theme-light-dark',
            'Темная тема',
            'Переключение между светлой и темной темой',
            isDark,
            () => toggleTheme()
          )}
          
          {renderSettingRow(
            'power',
            'Автоподключение',
            'Автоматически подключаться при запуске',
            user.settings.autoConnect,
            (value) => handleToggleSetting('autoConnect', value)
          )}
          
          {renderSettingRow(
            'bell',
            'Уведомления',
            'Показывать уведомления о состоянии VPN',
            user.settings.notifications,
            (value) => handleToggleSetting('notifications', value)
          )}
        </NeomorphCard>

        {/* Безопасность */}
        <NeomorphCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Безопасность
          </Text>
          
          {renderSettingRow(
            'shield-alert',
            'Kill Switch',
            'Блокировать интернет при отключении VPN',
            user.settings.killSwitch,
            (value) => handleToggleSetting('killSwitch', value)
          )}
          
          {renderSettingRow(
            'dns',
            'DNS защита',
            'Защита от утечек DNS',
            user.settings.dnsProtection,
            (value) => handleToggleSetting('dnsProtection', value)
          )}
          
          {renderSettingRow(
            'cog',
            'Автовыбор протокола',
            'Автоматически выбирать оптимальный протокол',
            user.settings.autoProtocol,
            (value) => handleToggleSetting('autoProtocol', value),
            true
          )}
          
          {renderSettingRow(
            'speedometer',
            'Уведомления о скорости',
            'Предупреждать о низкой скорости соединения',
            user.settings.speedAlerts,
            (value) => handleToggleSetting('speedAlerts', value),
            true
          )}
        </NeomorphCard>

        {/* Выбор протокола */}
        <NeomorphCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Протокол VPN
          </Text>
          
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Выберите протокол VPN для использования по умолчанию
          </Text>
          
          <View style={styles.protocolGrid}>
            {renderProtocolCard('wireguard')}
            {renderProtocolCard('shadowsocks')}
            {renderProtocolCard('vless-reality')}
          </View>
        </NeomorphCard>

        {/* Аккаунт */}
        <NeomorphCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Аккаунт
          </Text>
          
          <View style={styles.accountInfo}>
            <View style={styles.accountRow}>
              <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                Тип аккаунта:
              </Text>
              <Text style={[styles.accountValue, { color: colors.text }]}>
                {user.isPremium ? 'Премиум' : 'Бесплатный'}
              </Text>
            </View>
            
            <View style={styles.accountRow}>
              <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                Использовано трафика:
              </Text>
              <Text style={[styles.accountValue, { color: colors.text }]}>
                {(user.dataUsage / (1024 * 1024 * 1024)).toFixed(2)} GB
              </Text>
            </View>
            
            <View style={styles.accountRow}>
              <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                Подключенных устройств:
              </Text>
              <Text style={[styles.accountValue, { color: colors.text }]}>
                {user.devicesConnected}
              </Text>
            </View>
          </View>
          
          {!user.isPremium && (
            <NeomorphButton
              title="Обновиться до Премиум"
              icon="crown"
              variant="primary"
              onPress={() => console.log('Upgrade to premium')}
              style={styles.upgradeButton}
            />
          )}
        </NeomorphCard>

        {/* Дополнительно */}
        <NeomorphCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Дополнительно
          </Text>
          
          <View style={styles.additionalActions}>
            <NeomorphButton
              title="Тест скорости"
              icon="speedometer"
              variant="secondary"
              onPress={() => console.log('Speed test')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="Диагностика"
              icon="doctor"
              variant="secondary"
              onPress={() => console.log('Diagnostics')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="Поддержка"
              icon="help-circle"
              variant="secondary"
              onPress={() => console.log('Support')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="О приложении"
              icon="information"
              variant="secondary"
              onPress={() => console.log('About app')}
              style={styles.actionButton}
            />
          </View>
        </NeomorphCard>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  protocolGrid: {
    gap: 12,
  },
  protocolCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  protocolName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  protocolDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  protocolFeatures: {
    marginTop: 4,
  },
  protocolFeature: {
    fontSize: 12,
    marginBottom: 2,
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accountLabel: {
    fontSize: 14,
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  upgradeButton: {
    marginTop: 8,
  },
  additionalActions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});