import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import { useVPN } from '../hooks/useVPN';
import { useAuth } from '../hooks/useAuth';
import NeomorphCard from '../components/NeomorphCard';
import NeomorphButton from '../components/NeomorphButton';
import { VPNServer } from '../types';

type SortOption = 'country' | 'ping' | 'load';

export default function ServersScreen() {
  const { colors, isDark } = useTheme();
  const { servers, connection, connect, testServerPing, isLoading } = useVPN();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('country');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredAndSortedServers = servers
    .filter(server => {
      const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          server.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          server.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (showPremiumOnly && !user?.isPremium) {
        return matchesSearch && !server.premium;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'country':
          return a.country.localeCompare(b.country);
        case 'ping':
          return a.ping - b.ping;
        case 'load':
          return a.load - b.load;
        default:
          return 0;
      }
    });

  const handleServerConnect = async (server: VPNServer) => {
    if (server.premium && !user?.isPremium) {
      Alert.alert(
        'Премиум сервер',
        'Этот сервер доступен только для премиум пользователей. Хотите обновиться?',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Обновиться', onPress: () => console.log('Upgrade to premium') },
        ]
      );
      return;
    }

    if (connection.server?.id === server.id) {
      Alert.alert(
        'Уже подключено',
        'Вы уже подключены к этому серверу',
        [{ text: 'ОК' }]
      );
      return;
    }

    try {
      await connect(server, user?.settings.protocol);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  const handlePingTest = async (server: VPNServer) => {
    await testServerPing(server);
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return colors.success[500];
    if (load < 70) return colors.warning[500];
    return colors.error[500];
  };

  const getLoadText = (load: number) => {
    if (load < 30) return 'Низкая';
    if (load < 70) return 'Средняя';
    return 'Высокая';
  };

  const renderServerItem = ({ item: server }: { item: VPNServer }) => (
    <NeomorphCard style={styles.serverCard}>
      <View style={styles.serverHeader}>
        <View style={styles.serverInfo}>
          <Text style={[styles.serverName, { color: colors.text }]}>
            {server.name}
          </Text>
          <Text style={[styles.serverLocation, { color: colors.textSecondary }]}>
            {server.city}, {server.country}
          </Text>
        </View>
        
        <View style={styles.serverBadges}>
          {server.premium && (
            <View style={[styles.premiumBadge, { backgroundColor: colors.warning[500] }]}>
              <Icon name="crown" size={12} color="#ffffff" />
              <Text style={styles.premiumText}>PRO</Text>
            </View>
          )}
          
          {connection.server?.id === server.id && (
            <View style={[styles.connectedBadge, { backgroundColor: colors.success[500] }]}>
              <Icon name="check-circle" size={12} color="#ffffff" />
              <Text style={styles.connectedText}>Подключено</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.serverMetrics}>
        <View style={styles.metric}>
          <Icon name="wifi" size={16} color={colors.primary[500]} />
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            Пинг
          </Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {server.ping}мс
          </Text>
        </View>

        <View style={styles.metric}>
          <Icon name="server" size={16} color={getLoadColor(server.load)} />
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            Нагрузка
          </Text>
          <Text style={[styles.metricValue, { color: getLoadColor(server.load) }]}>
            {getLoadText(server.load)}
          </Text>
        </View>

        <View style={styles.metric}>
          <Icon name="shield-check" size={16} color={colors.primary[500]} />
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            Протоколы
          </Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {server.protocols.length}
          </Text>
        </View>
      </View>

      <View style={styles.serverActions}>
        <NeomorphButton
          title="Тест пинга"
          icon="speedometer"
          variant="secondary"
          size="small"
          onPress={() => handlePingTest(server)}
          style={styles.actionButton}
        />
        
        <NeomorphButton
          title={connection.server?.id === server.id ? "Подключено" : "Подключиться"}
          icon={connection.server?.id === server.id ? "check" : "play"}
          variant={connection.server?.id === server.id ? "success" : "primary"}
          size="small"
          disabled={connection.server?.id === server.id || isLoading}
          onPress={() => handleServerConnect(server)}
          style={[styles.actionButton, { flex: 1.5 }]}
        />
      </View>
    </NeomorphCard>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Серверы
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {filteredAndSortedServers.length} доступных серверов
        </Text>
      </View>

      {/* Поиск */}
      <NeomorphCard style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={[
              styles.searchInput,
              { 
                color: colors.text,
                borderColor: colors.border,
              }
            ]}
            placeholder="Поиск серверов..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </NeomorphCard>

      {/* Фильтры и сортировка */}
      <NeomorphCard style={styles.filtersCard}>
        <View style={styles.filtersContainer}>
          <Text style={[styles.filtersLabel, { color: colors.text }]}>
            Сортировка:
          </Text>
          
          <View style={styles.sortButtons}>
            {[
              { key: 'country', label: 'Страна', icon: 'earth' },
              { key: 'ping', label: 'Пинг', icon: 'wifi' },
              { key: 'load', label: 'Нагрузка', icon: 'server' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  {
                    backgroundColor: sortBy === option.key 
                      ? colors.primary[500] 
                      : 'transparent',
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setSortBy(option.key as SortOption)}
              >
                <Icon
                  name={option.icon}
                  size={16}
                  color={sortBy === option.key ? '#ffffff' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.sortButtonText,
                    {
                      color: sortBy === option.key ? '#ffffff' : colors.textSecondary,
                    }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </NeomorphCard>

      {/* Список серверов */}
      <FlatList
        data={filteredAndSortedServers}
        renderItem={renderServerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.serversList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  searchCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    paddingVertical: 8,
  },
  filtersCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  filtersContainer: {
    alignItems: 'center',
  },
  filtersLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  sortButtonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  serversList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  serverCard: {
    marginBottom: 16,
  },
  serverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  serverLocation: {
    fontSize: 14,
  },
  serverBadges: {
    flexDirection: 'row',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  premiumText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  connectedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  serverMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  serverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});