import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import FormContainer from "../../shared/form/FormContainer";
import Input from "../../shared/form/Input";
import EasyButton from "../../shared/StyledComponents/EasyButton";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import Error from "../../shared/Error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import {ActivityIndicator} from "react-native-paper";

const ProductForm = (props) => {
  const [pickerValue, setPickerValue] = useState();
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [richDescription, setRichDescription] = useState("");
  const [numReviews, setNumReviews] = useState(0);
  const [item, setItem] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //provjera da li je edit ili add
    if (!props.route.params) setItem(null);
    else {
      setItem(props.route.params.item);
      let itemProp = props.route.params.item;
      setBrand(itemProp.brand);
      setName(itemProp.name);
      setPrice(itemProp.price.toString());
      setDescription(itemProp.description);
      setCountInStock(itemProp.countInStock.toString());
      setMainImage(itemProp.image);
      setImage(itemProp.image);
      setCategory(itemProp.category._id);
    }

    console.log(category);

    //token
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((err) => console.log(err));

    //categories
    axios
      .get(`${baseURL}categories`)
      .then((res) => {
        setCategories(res.data);
        console.log(res.data);
      })
      .catch((err) => alert("Error to load categories"));

    //image picker
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    return () => {
      setCategories();
    };
  }, []);

  useEffect(() => {
  if (categories.length > 0 && item) {
    setPickerValue(item.category._id);
    setCategory(item.category._id);
  }
}, [categories, item]);


  const pickImage = async () => {
    console.log("kliknula");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setMainImage(uri);
      setImage(uri);
    }
  };

  const addProduct = () => {
    if (
      name == "" ||
      brand == "" ||
      price == "" ||
      description == "" ||
      category == "" ||
      countInStock == ""
    ) {
      setError("Please fill in the form correctly");
    }

    setLoading(true); 
    console.log("---------------");
    console.log(category);

    let formData = new FormData();

    //image

    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: image.split("/").pop(),
    });

    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("countInStock", countInStock);
    formData.append("richDescription", richDescription);
    formData.append("rating", rating);
    formData.append("numReviews", numReviews);
    formData.append("isFeatured", isFeatured);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      axios
        .put(`${baseURL}products/${item._id}`, formData, config)
         .then((res) => {
          setLoading(false); 

          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product successfully updated",
              text2: "",
            });
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((err) => {
          setLoading(false); 

          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        })
    } 
    else {
      axios
        .post(`${baseURL}products`, formData, config)
        .then((res) => {
          setLoading(false); 

          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Product added",
              text2: "",
            });
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((err) => {
          setLoading(false); 

          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      //   extraHeight={200}
      enableOnAndroid={true}
      style={{ backgroundColor: "white" }}
      contentContainerStyle={{
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FormContainer title="Add Product">
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: mainImage }} />
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Icon style={{ color: "white" }} name="camera" />
          </TouchableOpacity>
        </View>
        <View style={styles.label}>
          <Text style={{ textDecorationLine: "underline" }}>Brand</Text>
          <Input
            placeholder="Brand"
            name="brand"
            id="brand"
            value={brand}
            onChangeText={(text) => setBrand(text)}
          />
        </View>
        <View style={styles.label}>
          <Text style={{ textDecorationLine: "underline" }}>Name</Text>
          <Input
            placeholder="Name"
            name="name"
            id="name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.label}>
          <Text style={{ textDecorationLine: "underline" }}>Price</Text>
          <Input
            placeholder="Price"
            name="price"
            id="price"
            value={price}
            keyboardType="numeric"
            onChangeText={(text) => setPrice(text)}
          />
        </View>
        <View style={styles.label}>
          <Text style={{ textDecorationLine: "underline" }}>Stock</Text>
          <Input
            placeholder="Stock"
            name="stock"
            id="stock"
            value={countInStock}
            keyboardType="numeric"
            onChangeText={(text) => setCountInStock(text)}
          />
        </View>
        <View style={styles.label}>
          <Text style={{ textDecorationLine: "underline" }}>Description</Text>
          <Input
            placeholder="Description"
            name="description"
            id="description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <View style={styles.label}>
          <Text style={{ textDecorationLine: "underline" }}>Category</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.inputSelect}
            data={categories}
            labelField="name"
            valueField="_id"
            placeholder="Select category"
            value={pickerValue}
            onChange={(item) => [
              setPickerValue(item._id),
              setCategory(item._id),
            ]}
            containerStyle={{ marginBottom: 20 }}
          />
        </View>
        {error ? <Error message={error} /> : null}
        <View style={styles.buttonContainer}>
          <EasyButton large primary onPress={addProduct} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Confirm</Text>
            )}
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  dropdown: {
    height: 60,
    width: "100%",
    borderRadius: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f9bf85ff",

    backgroundColor: "white",
    marginVertical: 10,
    padding: 10,
    paddingHorizontal: 8,
    fontSize: 4,
  },
  placeholderStyle: { color: "#999", fontSize: 14 },
  selectedTextStyle: { color: "#000", fontSize: 14 },
  inputSelect: { color: "#000", fontSize: 14 },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    elevation: 10,
    borderColor: "#e0e0e0",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default ProductForm;
