import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "react-native-vector-icons/FontAwesome";
import { Text } from "react-native-paper";
import TrafficLight from "./StyledComponents/TrafficLight";
import EasyButton from "./StyledComponents/EasyButton";
import { Dropdown } from "react-native-element-dropdown";

import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";

const codes = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
];

const OrderCard = (props) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [statusChange, setStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();

  console.log(props.status);

  const setVisualStatus = (status) => {
    if (status === "Pending") {
      setOrderStatus(<TrafficLight unavailable />);
      setStatusText("Pending");
      setCardColor("#ec5d4eff");
    } else if (status === "Shipped") {
      setOrderStatus(<TrafficLight limited />);
      setStatusText("Shipped");
      setCardColor("#f1c40f");
    } else if (status === "Delivered") {
      setOrderStatus(<TrafficLight available />);
      setStatusText("Delivered");
      setCardColor("#2ecc71");
    }
  };

  useEffect(() => {
    if (props.editMode) {
      AsyncStorage.getItem("jwt")
        .then((res) => setToken(res))
        .catch((err) => console.log(err));
    }

    setVisualStatus(props.status);
    setStatusChange(props.status);

    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor();
    };
  }, []);

  const updateOrder = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const order = {
      //   city: props.city,
      //   country: props.country,
      //   dateOrdered: props.dateOrdered,
      //   id: props._id,
      //   orderItems: props.orderItems,
      //   phone: props.phone,
      //   shippingAddress1: props.shippingAddress1,
      //   shippingAddress2: props.shippingAddress2,
      status: statusChange,
      //   totalPrice: props.totalPrice,
      //   user: props.user,
      //   zip: props.zip,
    };

    axios
      .put(`${baseURL}orders/${props._id}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order updated successfully",
            text2: "",
          });

          setVisualStatus(statusChange);
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
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View>
        <Text style={styles.container}>Order Number: #{props.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text>
          Status: {statusText} {orderStatus}
        </Text>
        <Text>Address1: {props.shippingAddress1}</Text>
        <Text>Address2: {props.shippingAddress2}</Text>
        <Text>City: {props.city}</Text>
        <Text>Country: {props.country}</Text>
        <Text>Date ordered: {props.dateOrdered.split("T")[0]}</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ textDecorationLine: "underline" }}>Creator</Text>
          <View style={{ flexDirection: "column", marginLeft: 10 }}>
            <Text>Name: {props.user.name}</Text>
            <Text>Email: {props.user.email}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text>Price: </Text>
          <Text style={styles.price}>$ {props.totalPrice}</Text>
        </View>
        {props.editMode ? (
          <View style={{alignItems:'center'}}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.inputSelect}
              data={codes}
              labelField="label"
              valueField="value"
              placeholder="Change status"
              value={statusChange}
              onChange={(item) => {
                setStatusChange(item.value);
                // setVisualStatus(item.value)
              }}
              containerStyle={{ marginBottom: 20 }}
            />
            <EasyButton
              secondary
              large
              onPress={() => {
                updateOrder();
              }}
            >
              <Text style={{ color: "white" }}>Update</Text>
            </EasyButton>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 30,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  title: {
    backgroundColor: "#62b1f6",
    padding: 5,
  },
  priceContainer: {
    alignSelf: "flex-end",
    marginTop: 10,
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
  dropdown: {
    height: 40,
    width: "100%",
    borderRadius: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",

    backgroundColor: "white",
    marginVertical: 10,
    padding: 10,
    paddingHorizontal: 8,
    fontSize: 4,
  },
  placeholderStyle: { color: "#999", fontSize: 14 },
  selectedTextStyle: { color: "#000", fontSize: 14 },
  inputSelect: { color: "#000", fontSize: 14 },
});

export default OrderCard;
