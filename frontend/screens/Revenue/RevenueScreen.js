import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getRevenueAPI } from "../../api/orderService";

export default function RevenueScreen() {
  const [revenue, setRevenue] = useState(0);

  const [filter, setFilter] = useState("All Time");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getRevenueAPI(filter);
        setRevenue(res.data.totalRevenue);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch revenue", err);
      }
    };
    fetch();
  }, [filter]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item._id}</Text>
      <Text style={styles.orderDate}>
        Date: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.orderTotal}>Total: ${item.totalAmount}</Text>
      <View style={styles.itemsList}>
        {item.items.map((prod, idx) => (
          <Text key={idx} style={styles.itemText}>
            - {prod.name} (x{prod.quantity}) : ${prod.price * prod.quantity}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Total Revenue</Text>
        <Text style={styles.revenueText}>${revenue}</Text>
      </View>

      <Text style={styles.subtitle}>Filter by:</Text>
      <View style={styles.filterContainer}>
        {["Day", "Month", "Year", "All Time"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === "Day" ? "Today" : f === "Month" ? "This Month" : f === "Year" ? "This Year" : "All Time"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.listTitle}>Orders ({orders.length})</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 18, color: "#666", marginBottom: 5 },
  revenueText: { fontSize: 32, fontWeight: "bold", color: "#4361ee" },
  subtitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#333" },
  filterContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    alignItems: "center",
  },
  filterBtnActive: { backgroundColor: "#4361ee" },
  filterText: { fontSize: 13, color: "#495057", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4361ee",
  },
  orderId: { fontSize: 12, color: "#888", marginBottom: 5 },
  orderDate: { fontSize: 14, color: "#555", marginBottom: 5 },
  orderTotal: { fontSize: 16, fontWeight: "bold", color: "#2b2d42", marginBottom: 10 },
  itemsList: { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 10 },
  itemText: { fontSize: 13, color: "#666", marginBottom: 3 },
  emptyText: { textAlign: "center", color: "#888", marginTop: 20, fontSize: 15 }
});