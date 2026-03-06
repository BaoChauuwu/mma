import React, { useContext } from "react";
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from "react-native";
import { CartContext } from "../../context/CartContext";
import Toast from 'react-native-toast-message';

export default function ProductDetailScreen({ route, navigation }) {
    const { item } = route.params;
    const { addToCart } = useContext(CartContext);

    return (
        <ScrollView style={styles.container}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.quantity}>Stock: {item.quantity}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Add to Cart" onPress={() => {
                    addToCart(item);
                    Toast.show({
                        type: 'success',
                        text1: 'Added to cart',
                        text2: `${item.name} has been added to your cart.`
                    });
                }} />
                <Button title="Go Back" onPress={() => navigation.goBack()} color="gray" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    image: { width: "100%", height: 300, resizeMode: "contain", marginBottom: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    price: { fontSize: 20, color: "green", marginBottom: 5 },
    quantity: { fontSize: 16, color: "gray", marginBottom: 15 },
    description: { fontSize: 16, lineHeight: 24, marginBottom: 30, color: "#333" },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 40 }
});
