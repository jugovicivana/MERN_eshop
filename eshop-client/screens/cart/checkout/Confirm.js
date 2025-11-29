import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import {
  Appbar,
  Card,
  List,
  RadioButton,
  Text,
  Button,
  Avatar,
} from "react-native-paper";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../redux/slices/cartSlice";
import EasyButton from "../../../shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");
const Confirm = (props) => {
  const confirm = props.route.params;
  const dispatch = useDispatch();
  const [token, setToken] = useState();

  // console.log("*************")
  // console.log(confirm.order.order);

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const confirmOrder = () => {
    if (!token) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Not authorized",
        text2: "Please log in again",
      });
      return;
    }

    const order = confirm.order.order;

    console.log(order);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseURL}orders`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Completed",
            text2: "",
          });

          setTimeout(() => {
            dispatch(clearCart());
            props.navigation.navigate("Cart");
          }, 1000);
        }
      })
      .catch((err) =>
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        })
      );
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="titleLarge">Confirm Order</Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "#f9bf85ff" }}>
            <Text style={styles.title}>Shipping to:</Text>
            <View style={{ padding: 8 }}>
              <Text>Address: {confirm.order.order.shippingAddress1}</Text>
              <Text>Address 2: {confirm.order.order.shippingAddress2}</Text>
              <Text>City: {confirm.order.order.city}</Text>
              <Text>Zip Code: {confirm.order.order.zip}</Text>
              <Text>Country: {confirm.order.order.country}</Text>
            </View>
            <Text style={styles.title}>Items:</Text>
            {confirm.order.order.orderItems.map((x) => {
              return (
                <View style={styles.row}>
                  <Avatar.Image
                    source={{
                      uri: x.product.image
                        ? x.product.image
                        : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                    }}
                    style={styles.image}
                  />
                  <View style={styles.textContainer}>
                    <Text
                      variant="titleMedium"
                      style={{ flexWrap: "wrap", flexShrink: 1 }}
                    >
                      {x.product.name}
                    </Text>
                    <Text variant="bodyMedium">{x.quantity}</Text>
                    <Text variant="bodySmall">${x.product.price}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
        <View style={{ alignItems: "center", margin: 20, width: "100%" }}>
          <EasyButton secondary large onPress={() => confirmOrder()}>
            <Text style={{ color: "white" }}>Place Order</Text>
          </EasyButton>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 1.2,
    padding: 5,
  },
  image: {
    // width: 40,
    // height: 40,
    // borderRadius: 8,
    // marginRight: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column", // ili row, zavisno šta želiš
    maxWidth: "100%",
  },
});
export default Confirm;
