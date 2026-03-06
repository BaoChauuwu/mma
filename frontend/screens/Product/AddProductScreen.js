import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { addProductAPI } from "../../api/productService";

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");

  const handleAdd = async () => {
    await addProductAPI({ name, description, price, quantity, image });
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" borderWidth={1} onChangeText={setName} />
      <TextInput placeholder="Desc" borderWidth={1} onChangeText={setDesc} />
      <TextInput placeholder="Price" borderWidth={1} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput placeholder="Quantity" borderWidth={1} onChangeText={setQuantity} keyboardType="numeric" />
      <TextInput placeholder="Image URL" borderWidth={1} onChangeText={setImage} />
      <Button title="Save" onPress={handleAdd} />
    </View>
  );
}