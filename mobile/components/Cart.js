import React from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';

export default function Cart({ items = [], onChangeQty = () => {}, onCheckout = () => {} }) {
  const totalCents = items.reduce((s, it) => s + it.price_cents * it.quantity, 0);
  return (
    <View>
      <Text style={styles.heading}>Cart</Text>
      {items.length === 0 && <Text>Your cart is empty</Text>}
      <FlatList
        data={items}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{(item.price_cents / 100).toFixed(2)} {item.currency}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={String(item.quantity)}
                onChangeText={t => {
                  const n = Math.max(0, parseInt(t || '0'));
                  onChangeQty(item.id, n);
                }}
              />
              <Text style={{ marginTop: 8 }}>{((item.price_cents * item.quantity) / 100).toFixed(2)} {item.currency}</Text>
            </View>
          </View>
        )}
      />
      {items.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.total}>Total: {(totalCents / 100).toFixed(2)} USD</Text>
          <Button title="Proceed to buy (mocked)" onPress={onCheckout} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  item: { flexDirection: 'row', padding: 8, borderBottomColor: '#eee', borderBottomWidth: 1 },
  name: { fontWeight: '600' },
  price: { color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', width: 60, padding: 6, textAlign: 'center', borderRadius: 4 },
  total: { fontWeight: '700', fontSize: 16, marginBottom: 8 }
});
