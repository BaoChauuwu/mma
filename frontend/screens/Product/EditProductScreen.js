import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { updateProductAPI } from "../../api/productService";

export default function EditProductScreen({ route, navigation }) {
    const { item } = route.params;

    const [name, setName] = useState(item.name || "");
    const [description, setDesc] = useState(item.description || "");
    const [price, setPrice] = useState(String(item.price || ""));
    const [quantity, setQuantity] = useState(String(item.quantity !== undefined ? item.quantity : ""));
    const [image, setImage] = useState(item.image || "");

    const handleUpdate = async () => {
        try {
            await updateProductAPI(item._id, { name, description, price, quantity, image });
            Alert.alert("Success", "Product updated successfully");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to update product");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDesc} multiline />
            <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Image URL" value={image} onChangeText={setImage} />
            <Button title="Update Product" onPress={handleUpdate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 15, borderRadius: 5, fontSize: 16 }
});
