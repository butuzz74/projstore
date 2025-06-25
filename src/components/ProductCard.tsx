import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ProductCardProps = {
  type: string;
  brand: string;
  model: string;
  serialNumber: string;
  manufactureCountry: string;
  createdAt: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  type,
  brand,
  model,
  serialNumber,
  manufactureCountry,
  createdAt,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {brand} {model}
      </Text>
      <Text style={styles.serial}>Серийный номер: {serialNumber}</Text>
      <View style={styles.divider} />
      <Text style={styles.label}>
        Тип: <Text style={styles.value}>{type}</Text>
      </Text>
      <Text style={styles.label}>
        Страна производства:{' '}
        <Text style={styles.value}>{manufactureCountry}</Text>
      </Text>
      <Text style={styles.label}>
        Дата поступления на склад: <Text style={styles.value}>{createdAt}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serial: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    color: '#000',
    fontWeight: '500',
  },
});

export default ProductCard;
