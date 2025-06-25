import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_EXPIRATION, brands, deviceTypes } from '../config/config';
import { ProductType } from '../types/types';
import { API_URL } from '@env';

const FilterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [model, setModel] = useState('');
  const [count, setCount] = useState<number | null>(null);

  const handleFilter = async () => {
    if (!selectedType && !selectedBrand && !model) {
      Alert.alert('Ошибка', 'Укажите хотя бы один параметр для фильтрации');
      return;
    }

    try {
      const now = Date.now();
      const cacheKey = 'stockData';
      const cached = await AsyncStorage.getItem(cacheKey);
      const cachedAt = await AsyncStorage.getItem(`${cacheKey}Timestamp`);

      let products: ProductType[] = [];

      if (cached && cachedAt && now - Number(cachedAt) < CACHE_EXPIRATION) {
        products = JSON.parse(cached);
      } else {
        const response = await fetch(`${API_URL}/api/products`);
        products = await response.json();
        await AsyncStorage.setItem(cacheKey, JSON.stringify(products));
        await AsyncStorage.setItem(`${cacheKey}Timestamp`, now.toString());
      }

      const filtered = products.filter(p => {
        return (
          (!selectedType || p.deviceType === selectedType) &&
          (!selectedBrand || p.brand === selectedBrand) &&
          (!model || p.model.toLowerCase().includes(model.toLowerCase()))
        );
      });

      setCount(filtered.length);
      setModel('');
      setSelectedBrand('');
      setSelectedType('');
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось получить данные');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Фильтр по параметрам</Text>

      <Text style={styles.label}>Тип устройства</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedType}
          onValueChange={value => setSelectedType(value)}
        >
          <Picker.Item label="Выберите тип" value="" />
          {deviceTypes.map(type => (
            <Picker.Item label={type} value={type} key={type} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Бренд</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedBrand}
          onValueChange={value => setSelectedBrand(value)}
        >
          <Picker.Item label="Выберите бренд" value="" />
          {brands.map(b => (
            <Picker.Item label={b} value={b} key={b} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Модель</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите модель"
        value={model}
        onChangeText={text => setModel(text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleFilter}>
        <Text style={styles.buttonText}>Получить данные</Text>
      </TouchableOpacity>

      {count !== null && (
        <Text style={styles.resultText}>Найдено: {count} штук</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>ГЛАВНОЕ МЕНЮ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    elevation: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FilterScreen;
