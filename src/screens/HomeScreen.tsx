import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import { useVPN } from '../hooks/useVPN';
import { useAuth } from '../hooks/useAuth';
import NeomorphCard from '../components/NeomorphCard';
import NeomorphButton from '../components/NeomorphButton';
import ConnectionButton from '../components/ConnectionButton';
import WorldMap from '../components/WorldMap';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { connection, networkStatus, getLocationInfo } = useVPN();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocationInfo();
    setRefreshing(false);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSpeedText = (): string => {
    if (connection.status !== 'connected') return 'Не подключено';
    
    // Симуляция скорости (в реальном приложении это будет получаться из VPN)
    const speed = Math.random() * 100 + 20;
    return `${speed.toFixed(1)} Mbps`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            SecureVPN
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Защищенное соединение
          </Text>
        </View>

        {/* Кнопка подключения */}
        <NeomorphCard style={styles.connectionCard}>
          <ConnectionButton />
        </NeomorphCard>

        {/* Информация о подключении */}
        <NeomorphCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="ip" size={20} color={colors.primary[500]} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                IP адрес
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {networkStatus.publicIP || 'Не определен'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="speedometer" size={20} color={colors.primary[500]} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Скорость
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {getSpeedText()}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="map-marker" size={20} color={colors.primary[500]} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Локация
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {networkStatus.location 
                  ? `${networkStatus.location.city}, ${networkStatus.location.country}`
                  : 'Не определена'
                }
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="shield-check" size={20} color={colors.primary[500]} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Протокол
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {connection.protocol?.toUpperCase() || 'Не выбран'}
              </Text>
            </View>
          </View>
        </NeomorphCard>

        {/* Карта мира */}
        <NeomorphCard style={styles.mapCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Серверы по всему миру
          </Text>
          <WorldMap />
        </NeomorphCard>

        {/* Статистика трафика */}
        {connection.status === 'connected' && (
          <NeomorphCard style={styles.statsCard}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Статистика трафика
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="download" size={24} color={colors.success[500]} />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Получено
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatBytes(connection.bytesReceived)}
                </Text>
              </View>
              
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              
              <View style={styles.statItem}>
                <Icon name="upload" size={24} color={colors.warning[500]} />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Отправлено
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatBytes(connection.bytesSent)}
                </Text>
              </View>
            </View>
          </NeomorphCard>
        )}

        {/* Быстрые действия */}
        <NeomorphCard style={styles.actionsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Быстрые действия
          </Text>
          
          <View style={styles.actionsGrid}>
            <NeomorphButton
              title="Тест скорости"
              icon="speedometer"
              variant="secondary"
              size="medium"
              onPress={() => console.log('Тест скорости')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="Kill Switch"
              icon={user?.settings.killSwitch ? "shield-check" : "shield-off"}
              variant={user?.settings.killSwitch ? "success" : "secondary"}
              size="medium"
              onPress={() => console.log('Toggle Kill Switch')}
              style={styles.actionButton}
            />
          </View>
          
          <View style={styles.actionsGrid}>
            <NeomorphButton
              title="DNS защита"
              icon={user?.settings.dnsProtection ? "dns" : "dns-outline"}
              variant={user?.settings.dnsProtection ? "success" : "secondary"}
              size="medium"
              onPress={() => console.log('Toggle DNS Protection')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="Настройки"
              icon="cog"
              variant="secondary"
              size="medium"
              onPress={() => console.log('Открыть настройки')}
              style={styles.actionButton}
            />
          </View>
        </NeomorphCard>

        {/* Нижний отступ */}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  connectionCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  infoCard: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapCard: {
    marginBottom: 20,
    height: 200,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
    marginHorizontal: 20,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  bottomSpacing: {
    height: 100,
  },
});