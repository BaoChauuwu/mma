import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ProductListScreen from "../screens/Product/ProductListScreen";
import AddProductScreen from "../screens/Product/AddProductScreen";
import EditProductScreen from "../screens/Product/EditProductScreen";
import ProductDetailScreen from "../screens/Product/ProductDetailScreen";
import CartScreen from "../screens/Cart/CartScreen";
import RevenueScreen from "../screens/Revenue/RevenueScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Products" component={ProductListScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} />
            <Stack.Screen name="EditProduct" component={EditProductScreen} options={{ title: 'Edit Product' }} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Revenue" component={RevenueScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}