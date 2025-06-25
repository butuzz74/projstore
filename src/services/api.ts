import { Alert } from 'react-native';

export const handleRecieveProductNumber = async () => {
  try {
    const response = await fetch('http://31.129.33.170:4000/api/products');

    const result = await response.json();
    if (response.ok) {
      console.log(result);
      Alert.alert('Успех', 'Данные успешно отправлены!');
    } else {
      Alert.alert(`Ошибка : ${result?.message}`, `Код: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Сетевая ошибка', 'Не удалось отправить данные');
  }
};
