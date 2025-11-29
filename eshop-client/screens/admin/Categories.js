import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";

var { width } = Dimensions.get("window");

const Item = (props) => {
  return (
  
    <View style={styles.item}>
      <Text>{props.item.name}</Text>
      <EasyButton
        danger
        medium
        onPress={() => {
          props.deleteItem(props.item._id);
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
      </EasyButton>
    </View>
  );
};

const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => setToken(res))
      .catch((err) => console.log(err));

    axios
      .get(`${baseURL}categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => alert("Error to load categories"));

    return () => {
      setCategories([]);
      setToken();
    };
  }, []);

  const addCategory = () => {
    const category = {
      name: categoryName,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseURL}categories`, category, config)
      .then((res) => setCategories([...categories, res.data]))
      .catch((err) => alert("Error to load categories"));

    setCategoryName("");
  };

  const deleteCategory = (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .delete(`${baseURL}categories/${id}`, config)
      .then((res) => {
        const newCategories = categories.filter((item) => item._id !== id);
        setCategories(newCategories);
      })
      .catch((err) => alert("Error to load categories"));
  };

  return (
    
    <View
      style={{ position: "relative", height: "100%", backgroundColor: "white" }}
    >
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={categories}
          renderItem={({ item, index }) => (
            <Item item={item} index={index} deleteItem={deleteCategory} />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
      <View style={styles.bottomBar}>
        <View>
          <Text>Add Category</Text>
        </View>
        <View style={{ width: width / 2.5 }}>
          <TextInput
            value={categoryName}
            style={styles.input}
            onChangeText={(text) => setCategoryName(text)}
          />
        </View>
        <View>
          <EasyButton
            medium
            primary
            onPress={() => {
              addCategory();
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
          </EasyButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: "white",
    width: width,
    height: 60,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15,
  },
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    marginVertical: 10,
    marginHorizontal: 15,
    padding: 5,
    elevation: 5,
    shadowRadius: 1,
    shadowOpacity: 0.2,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
  },
});
export default Categories;
