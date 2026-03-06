import React, { useContext } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet, ScrollView } from "react-native";
import { CartContext } from "../../context/CartContext";
import { createOrderAPI } from "../../api/orderService";
import { AuthContext } from "../../context/AuthContext";
import Toast from 'react-native-toast-message';

export default function CartScreen() {
  const { cart, removeItem, updateQty, total, setCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);

  const checkout = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: 'Please login to checkout'
      });
      return;
    }

    try {
      await createOrderAPI({
        userId: user._id,
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total
      });
      setCart([]);
      Toast.show({
        type: 'success',
        text1: 'Order Placed!',
        text2: 'Checkout successful!'
      });
    } catch (error) {
      console.log("Checkout error:", error);
      Toast.show({
        type: 'error',
        text1: 'Checkout Failed',
        text2: 'Please try again.'
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {cart.map(item => (
        <View key={item._id} style={styles.cartItem}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.qtyRow}>
            <Text>Qty: </Text>
            <TextInput
              style={styles.input}
              defaultValue={String(item.quantity)}
              keyboardType="numeric"
              onChangeText={(qty) =>
                updateQty(item._id, Number(qty) || 0)
              }
            />
          </View>
          <Text style={styles.itemPrice}>Price: ${item.price * item.quantity}</Text>
          <Button
            title="Remove"
            color="red"
            onPress={() => removeItem(item._id)}
          />
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total: ${total}</Text>
      </View>

      {cart.length > 0 ? (
        <View style={styles.checkoutBtnContainer}>
          <Button title="Checkout" onPress={checkout} />
        </View>
      ) : (
        <Text style={styles.emptyText}>Cart is empty</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  cartItem: { marginBottom: 15, padding: 15, backgroundColor: "#fff", borderRadius: 8, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  itemName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 5, width: 50, marginLeft: 10, textAlign: "center" },
  itemPrice: { fontSize: 16, marginBottom: 10, color: "green", fontWeight: "bold" },
  totalRow: { marginTop: 20, marginBottom: 20, padding: 10, borderTopWidth: 1, borderColor: "#ccc", alignItems: "flex-end" },
  totalText: { fontSize: 20, fontWeight: "bold" },
  checkoutBtnContainer: { marginBottom: 40 },
  emptyText: { textAlign: "center", fontSize: 16, marginTop: 50, color: "#888" }
});