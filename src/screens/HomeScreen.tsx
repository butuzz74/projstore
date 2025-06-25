import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ResultData } from '../types/types';
import { useCachedFetch } from '../hooks/useCachedFetch';
import { downloadAndOpenExcel } from '../utils/downloadAndOpenExcel';
import { API_URL } from '@env';

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    data: products,
    error,
    loading,
    updatedAt,
    refetch: updateProduct,
  } = useCachedFetch<ResultData[]>(`${API_URL}/api/products`, 'stockData');

  const numberProduct = products?.length ?? 0;

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hours = updatedAt?.getHours();
  const minutes = updatedAt?.getMinutes();

  if (error) {
    Alert.alert('Ошибка', 'Не удалось загрузить данные');
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar backgroundColor="#808080" barStyle="dark-content" />

      <View style={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>ProjStore</Text>
        <Text style={styles.subtitle}>Учёт продукции на складе</Text>

        {!loading && (
          <>
            <Text style={styles.inventoryText}>
              Товаров на складе {day}.{month < 10 ? `0${month}` : `${month}`}.
              {year} — {numberProduct} штук
            </Text>
            {updatedAt && (
              <Text style={styles.cacheInfoText}>
                Обновлено в {hours}:{minutes?.toString().padStart(2, '0')}
              </Text>
            )}
            <TouchableOpacity style={styles.button} onPress={updateProduct}>
              <Text style={styles.buttonText}>Обновить</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Product')}
        >
          <Text style={styles.buttonText}>
            Поиск товара по серийному номеру
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Filter')}
        >
          <Text style={styles.buttonText}>
            Получить данные по иным параметрам
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => downloadAndOpenExcel('created')}
        >
          <Text style={styles.buttonText}>
            Скачать журнал поступления на склад
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => downloadAndOpenExcel('deleted')}
        >
          <Text style={styles.buttonText}>
            Скачать журнал отгрузки со склада
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => BackHandler.exitApp()}
        >
          <Text style={styles.buttonText}>ВЫЙТИ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#d6d6d6',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  inventoryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  cacheInfoText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default HomeScreen;
