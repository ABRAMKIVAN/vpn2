import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useVPN } from '../hooks/useVPN';
import NeomorphCard from '../components/NeomorphCard';
import NeomorphButton from '../components/NeomorphButton';
import { APP_CONFIG } from '../constants';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { user, signOut } = useAuth();
  const { connection } = useVPN();
  const [showUsageChart, setShowUsageChart] = useState(true);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error[500] }]}>
          Ошибка загрузки профиля
        </Text>
      </SafeAreaView>
    );
  }

  const handleSignOut = () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы уверены, что хотите выйти? Все данные будут удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDataUsagePercentage = (): number => {
    if (user.isPremium) return 0; // Безлимитный для премиум
    return (user.dataUsage / APP_CONFIG.FREE_DATA_LIMIT) * 100;
  };

  const getRemainingData = (): string => {
    if (user.isPremium) return 'Безлимитно';
    const remaining = APP_CONFIG.FREE_DATA_LIMIT - user.dataUsage;
    return formatBytes(Math.max(0, remaining));
  };

  // Моковые данные для графика использования
  const usageChartData = {
    labels: ['1 нед', '2 нед', '3 нед', '4 нед'],
    datasets: [
      {
        data: [2.3, 4.1, 3.8, 5.2], // GB
        color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => isDark 
      ? `rgba(255, 255, 255, ${opacity * 0.7})` 
      : `rgba(0, 0, 0, ${opacity * 0.7})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary[500],
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Профиль
          </Text>
        </View>

        {/* Информация об аккаунте */}
        <NeomorphCard style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.avatarContainer}>
              <Icon name="account-circle" size={80} color={colors.primary[500]} />
              {user.isPremium && (
                <View style={[styles.premiumBadge, { backgroundColor: colors.warning[500] }]}>
                  <Icon name="crown" size={16} color="#ffffff" />
                </View>
              )}
            </View>
            
            <View style={styles.accountInfo}>
              <Text style={[styles.accountTitle, { color: colors.text }]}>
                {user.isAnonymous ? 'Анонимный пользователь' : 'Пользователь'}
              </Text>
              <Text style={[styles.accountSubtitle, { color: colors.textSecondary }]}>
                {user.isPremium ? 'Премиум аккаунт' : 'Бесплатный аккаунт'}
              </Text>
              <Text style={[styles.accountId, { color: colors.textSecondary }]}>
                ID: {user.id.slice(-8)}
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

        {/* Статистика использования */}
        <NeomorphCard style={styles.statsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Использование данных
          </Text>
          
          <View style={styles.dataUsageContainer}>
            <View style={styles.dataUsageInfo}>
              <Text style={[styles.dataUsageLabel, { color: colors.textSecondary }]}>
                Использовано в этом месяце
              </Text>
              <Text style={[styles.dataUsageValue, { color: colors.text }]}>
                {formatBytes(user.dataUsage)}
              </Text>
              <Text style={[styles.dataUsageRemaining, { color: colors.textSecondary }]}>
                Осталось: {getRemainingData()}
              </Text>
            </View>
            
            {!user.isPremium && (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.border }
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, getDataUsagePercentage())}%`,
                        backgroundColor: getDataUsagePercentage() > 80 
                          ? colors.error[500] 
                          : colors.primary[500],
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                  {getDataUsagePercentage().toFixed(1)}% использовано
                </Text>
              </View>
            )}
          </View>
        </NeomorphCard>

        {/* График использования */}
        <NeomorphCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Статистика за месяц
            </Text>
            <NeomorphButton
              title={showUsageChart ? "График" : "Детали"}
              icon={showUsageChart ? "chart-line" : "format-list-bulleted"}
              variant="secondary"
              size="small"
              onPress={() => setShowUsageChart(!showUsageChart)}
            />
          </View>
          
          {showUsageChart ? (
            <View style={[styles.chart, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[{ color: colors.textSecondary }]}>
                График использования (демо)
              </Text>
            </View>
          ) : (
            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Icon name="calendar-week" size={20} color={colors.primary[500]} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Активных дней
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  18
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="clock-outline" size={20} color={colors.primary[500]} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Общее время подключения
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  47ч 32м
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="server-network" size={20} color={colors.primary[500]} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Использовано серверов
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  8
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="speedometer" size={20} color={colors.primary[500]} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Средняя скорость
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  45.2 Mbps
                </Text>
              </View>
            </View>
          )}
        </NeomorphCard>

        {/* Текущее подключение */}
        {connection.status === 'connected' && connection.server && (
          <NeomorphCard style={styles.connectionCard}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Текущее подключение
            </Text>
            
            <View style={styles.connectionInfo}>
              <View style={styles.connectionDetail}>
                <Icon name="server" size={20} color={colors.success[500]} />
                <Text style={[styles.connectionLabel, { color: colors.textSecondary }]}>
                  Сервер
                </Text>
                <Text style={[styles.connectionValue, { color: colors.text }]}>
                  {connection.server.name}
                </Text>
              </View>
              
              <View style={styles.connectionDetail}>
                <Icon name="shield-check" size={20} color={colors.success[500]} />
                <Text style={[styles.connectionLabel, { color: colors.textSecondary }]}>
                  Протокол
                </Text>
                <Text style={[styles.connectionValue, { color: colors.text }]}>
                  {connection.protocol?.toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.connectionDetail}>
                <Icon name="clock-outline" size={20} color={colors.success[500]} />
                <Text style={[styles.connectionLabel, { color: colors.textSecondary }]}>
                  Подключено
                </Text>
                <Text style={[styles.connectionValue, { color: colors.text }]}>
                  {connection.connectedAt && 
                    new Date(connection.connectedAt).toLocaleTimeString('ru-RU')
                  }
                </Text>
              </View>
            </View>
          </NeomorphCard>
        )}

        {/* Действия аккаунта */}
        <NeomorphCard style={styles.actionsCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Действия
          </Text>
          
          <View style={styles.actionsList}>
            <NeomorphButton
              title="Экспорт данных"
              icon="download"
              variant="secondary"
              onPress={() => console.log('Export data')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="Сбросить статистику"
              icon="refresh"
              variant="secondary"
              onPress={() => console.log('Reset stats')}
              style={styles.actionButton}
            />
            
            <NeomorphButton
              title="Выйти из аккаунта"
              icon="logout"
              variant="error"
              onPress={handleSignOut}
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
  accountCard: {
    marginBottom: 20,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountSubtitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  accountId: {
    fontSize: 12,
  },
  upgradeButton: {
    marginTop: 8,
  },
  statsCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  dataUsageContainer: {
    alignItems: 'center',
  },
  dataUsageInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dataUsageLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  dataUsageValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataUsageRemaining: {
    fontSize: 12,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
  },
  chartCard: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  detailsList: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  connectionCard: {
    marginBottom: 20,
  },
  connectionInfo: {
    marginTop: 8,
  },
  connectionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  connectionLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  connectionValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsCard: {
    marginBottom: 20,
  },
  actionsList: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});