import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import {
  getProductsAPI,
  deleteProductAPI
} from "../../api/productService";
import { CartContext } from "../../context/CartContext";

export default function ProductListScreen({ navigation }) {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc"); // 'asc' or 'desc'
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProductsAPI();
      setProducts(res.data);
    } catch (error) {
      console.log("Error fetching products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Refresh products every time the screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.price - b.price
        : b.price - a.price
    );

  const toggleSort = () => {
    setSort(sort === "asc" ? "desc" : "asc");
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ProductDetail", { item })}
      activeOpacity={0.9}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : (
        <View style={[styles.productImage, styles.placeholderImage]}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}

      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
        <Text style={styles.productStock}>Stock: {item.quantity}</Text>

        {item.description ? (
          <Text style={styles.productDesc} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => {
              addToCart(item);
              Toast.show({
                type: 'success',
                text1: 'Added to cart',
                text2: `${item.name} has been added to your cart.`
              });
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <View style={styles.adminActionsRow}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("EditProduct", { item })}
            >
              <Feather name="edit-2" size={18} color="#4361ee" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={async () => {
                await deleteProductAPI(item._id);
                fetchProducts();
              }}
            >
              <Feather name="trash-2" size={18} color="#ef233c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.headerBtn}>
          <Ionicons name="cart-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search & Sort Area */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.sortBtn} onPress={toggleSort}>
          <MaterialCommunityIcons
            name={sort === "asc" ? "sort-alphabetical-ascending" : "sort-alphabetical-descending"}
            size={24}
            color="#4361ee"
          />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4361ee" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id?.toString() || Math.random().toString()}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="box" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button for Add Product */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddProduct")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sortBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    borderWidth: 1,
    borderColor: '#d6e0ff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Important for FAB space
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  productImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e9ecef',
  },
  cardContent: {
    padding: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b2d42',
    marginRight: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4361ee',
  },
  productStock: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  productDesc: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#f1f3f5',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361ee',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  adminActionsRow: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginLeft: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: '#4361ee',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  }
});