import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductType } from '../types/types';
import { CACHE_EXPIRATION } from '../config/config';
import ProductCard from '../components/ProductCard';
import { formattedDate } from '../utils/formattedDate';
import { API_URL } from '@env';

const ProductSearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [serialNumber, setSerialNumber] = useState('');
  const [dataProduct, setDataProduct] = useState<ProductType[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleChange = (value: string) => {
    setSerialNumber(value);
  };

  const searchProductBySerialNumber = async (
    serialNum: string,
    cacheKey: string,
    cacheTimeMs: number = CACHE_EXPIRATION,
    url: string,
  ) => {
    try {
      const now = Date.now();
      const cached = await AsyncStorage.getItem(cacheKey);
      const cachedAt = await AsyncStorage.getItem(`${cacheKey}Timestamp`);
      if (cached && now - Number(cachedAt) < cacheTimeMs) {
        const data: ProductType[] = JSON.parse(cached);
        setDataProduct(data.filter(elem => elem.serialNumber === serialNum));
        setSerialNumber('');
      } else {
        const response = await fetch(url);
        const result: ProductType[] = await response.json();
        await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
        await AsyncStorage.setItem(`${cacheKey}Timestamp`, now.toString());
        setDataProduct(result.filter(elem => elem.serialNumber === serialNum));
        setSerialNumber('');
      }
    } catch (e) {
      setError(e as Error);
    }
  };

  if (error) {
    Alert.alert('Ошибка', 'Не удалось загрузить данные');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Поиск по серийному номеру</Text>
      <ScrollView contentContainerStyle={styles.form}>
        {dataProduct && dataProduct?.length !== 0 && (
          <ProductCard
            type={dataProduct[0].deviceType}
            brand={dataProduct[0].brand}
            model={dataProduct[0].model}
            serialNumber={dataProduct[0].serialNumber}
            manufactureCountry={dataProduct[0].manufactureCountry}
            createdAt={formattedDate(dataProduct[0].createdAt)}
          />
        )}
        {dataProduct && dataProduct?.length === 0 && (
          <Text style={styles.notFoundText}>Товар не найден</Text>
        )}
        <TextInput
          placeholder="Серийный номер"
          style={styles.input}
          placeholderTextColor="#999"
          value={serialNumber}
          onChangeText={text => handleChange(text.toUpperCase())}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            searchProductBySerialNumber(
              serialNumber,
              'stockData',
              CACHE_EXPIRATION,
              `${API_URL}/api/products?serialNumber=${serialNumber}`,
            )
          }
        >
          <Text style={styles.buttonText}>
            {dataProduct ? 'Продолжить' : 'Найти'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>ГЛАВНОЕ МЕНЮ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    padding: 16,
  },
  form: {
    paddingBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
    marginBottom: 10,
  },
  buttons: {
    gap: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#90caf9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
});

export default ProductSearchScreen;
