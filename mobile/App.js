import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Alert } from 'react-native';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cart)).catch(() => {});
  }, [cart]);

  async function fetchProducts() {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load products. Make sure backend is running.');
    }
  }

  async function loadCart() {
    try {
      const raw = await AsyncStorage.getItem('cart');
      if (raw) setCart(JSON.parse(raw));
    } catch (err) {
      console.error(err);
    }
  }

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { id: product.id, name: product.name, price_cents: product.price_cents, currency: product.currency, quantity: 1 }];
    });
  }

  function updateQuantity(id, qty) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: qty } : p).filter(p => p.quantity > 0));
  }

  function clearCart() {
    setCart([]);
  }

  async function checkout() {
    const total = cart.reduce((s, it) => s + it.price_cents * it.quantity, 0);
    try {
      const res = await fetch(`${API}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total_cents: total })
      });
      const json = await res.json();
      if (res.ok) {
        Alert.alert('Order placed', `Order ID: ${json.orderId}`);
        clearCart();
      } else {
        Alert.alert('Checkout failed', json.error || 'Unknown error');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Checkout failed', 'Could not reach server');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Simple Shop</Text>
      <View style={styles.content}>
        <View style={styles.products}>
          <ProductList products={products} onAdd={addToCart} />
        </View>
        <View style={styles.cart}>
          <Cart items={cart} onChangeQty={updateQuantity} onCheckout={checkout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', padding: 16 },
  content: { flex: 1, flexDirection: 'row' },
  products: { flex: 2, padding: 8 },
  cart: { width: 360, padding: 8 }
});
