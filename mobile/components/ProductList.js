import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

export default function ProductList({ products = [], onAdd = () => {} }) {
  if (!products || products.length === 0) {
    return <Text>Loading products...</Text>;
  }

  return (
    <View>
      <Text style={styles.heading}>Products</Text>
      <FlatList
        data={products}
        keyExtractor={p => p.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.price}>{(item.price_cents / 100).toFixed(2)} {item.currency}</Text>
              <Button title="Add" onPress={() => onAdd(item)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  item: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontWeight: '600' },
  desc: { color: '#666' },
  price: { fontWeight: '700', marginBottom: 6 }
});
