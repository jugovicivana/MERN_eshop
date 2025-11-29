import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  Text,
  Button,
  List,
  TextInput,
  Appbar,
  Searchbar,
  IconButton,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ListItem from "./ListItem";
import EasyButton from "../../shared/StyledComponents/EasyButton";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View style={[styles.listHeader, { elevation: 1 }]}>
      <View style={styles.headerItem}></View>
      <View style={styles.headerItem}>
        <Text variant="labelLarge">Brand</Text>
      </View>
      <View style={styles.headerItem}>
        <Text variant="labelLarge">Name</Text>
      </View>
      <View style={styles.headerItem}>
        <Text variant="labelLarge">Category</Text>
      </View>
      <View style={styles.headerItem}>
        <Text variant="labelLarge">Price</Text>
      </View>
    </View>
  );
};

const Products = (props) => {
  const [productList, setProductList] = useState();
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
    const [searchQuery, setSearchQuery] = useState("");
  

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}products`).then((response) => {
        setProductList(response.data);
        setProductFilter(response.data);
        setLoading(false);
      });

      return () => {
        setProductList();
        setProductFilter();
        setLoading(true);
      };
    }, [])
  );

  const searchProduct = (text) => {
    setSearchQuery(query);

    if (text == "") setProductFilter(productFilter);
    setProductFilter(
      productList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteProduct = (id) => {
    axios
      .delete(`${baseURL}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const products = productFilter.filter((item) => item._id !== id);
        setProductFilter(products);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Orders")}
        >
          <Icon
            name="shopping-bag"
            size={18}
            color={"white"}
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: "white" }}>Orders</Text>
        </EasyButton>

        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("ProductForm")}
        >
          <Icon
            name="plus"
            size={18}
            color={"white"}
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: "white" }}>Products</Text>
        </EasyButton>
        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Categories")}
        >
          <Icon
            name="plus"
            size={18}
            color={"white"}
            style={{ marginRight: 5 }}
          />
          <Text style={{ color: "white" }}>Categories</Text>
        </EasyButton>
      </View>
      <View>
        <Appbar.Header
          style={{
            marginTop: 0,
            paddingTop: 0,
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#e4f7fbff",
          }}
          statusBarHeight={2}
        >
          <Searchbar
            placeholder="Search"
            value={searchQuery}
            onChangeText={(text) => searchProduct(text)}
            style={styles.searchbar}
            inputStyle={{ fontSize: 16 }}
          />

          {/* <IconButton icon="close" size={24} style={{ marginRight: 0 }} /> */}
        </Appbar.Header>
      </View>
      {loading ? (
        <View style={styles.inidicatorContainer}>
          <ActivityIndicator size={"large"} color={"#154D71"} />
        </View>
      ) : (
        <FlatList
          data={productFilter}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListItem
              product={item}
              navigation={props.navigation}
              index={index}
              deleteProduct={deleteProduct}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    // marginBottom: 160,
  },
  searchbar: {
    flex: 1,
    // width:'80%',
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#e4f7fbff",
    // elevation: 0, // uklanja senku ako je potrebno
  },
  inidicatorContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    margin: 20,
    alignSelf: "center",
  },
});

export default Products;
