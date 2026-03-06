import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Toast from 'react-native-toast-message';

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <AppNavigator />
                <Toast />
            </CartProvider>
        </AuthProvider>
    );
}
