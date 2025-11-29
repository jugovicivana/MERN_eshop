import React, { useEffect, useState } from "react";
import { Avatar, Button, Menu } from "react-native-paper";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../../shared/form/FormContainer";
import Input from "../../../shared/form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import EasyButton from "../../../shared/StyledComponents/EasyButton";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux"; //da imamo pristup store-u
import { useAuth } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";


var { height, width } = Dimensions.get("window");

const countries = require("../../../assets/data/countries.json");

const Checkout = (props) => {
  const { stateUser, dispatch } = useAuth();

  const [orderItems, setOrderItems] = useState();
  const [address, setAddress] = useState();
  const [address2, setAddress2] = useState();
  const [city, setCity] = useState();
  const [zipCode, setZipCode] = useState();
  const [country, setCountry] = useState();
  const [phone, setPhone] = useState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  const data = countries.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => setToken(res))
      .catch((err) => console.log(err));

    const config = {
      header: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
    .get(`${baseURL}users/${stateUser.user.userId}`, config)
    .then((res)=>setUser(res.data))
    .catch((err)=>console.log(err));


    setOrderItems(props.route?.params?.cartItems);
    return () => {
      setOrderItems();
    };
  }, []);
  const checkout = () => {
    let order = {
      city,
      country,
      dateOrdered: Date.now(),
      orderItems,
      phone,
      shippingAddress1: address,
      shippingAddress2: address2,
      // status: "Pending",
      user,
      zip: zipCode,
    };

    props.navigation.navigate("Payment", { order: order });
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
      style={{ backgroundColor: "white", width: "100%" }}
    >
      <FormContainer title={"Shipping Address"}>
        <View style={styles.label}>
          <Input
            placeholder={"Phone"}
            name={"phone"}
            value={phone}
            keyboardType={"numeric"}
            onChangeText={(text) => setPhone(text)}
          />
        </View>
        <View style={styles.label}>
          <Input
            placeholder={"Shipping Address 1"}
            name={"ShippingAddress1"}
            value={address}
            onChangeText={(text) => setAddress(text)}
          />
        </View>
        <View style={styles.label}>
          <Input
            placeholder={"Shipping Address 2"}
            name={"ShippingAddress2"}
            value={address2}
            onChangeText={(text) => setAddress2(text)}
          />
        </View>
        <View style={styles.label}>
          <Input
            placeholder={"City"}
            name={"City"}
            value={city}
            onChangeText={(text) => setCity(text)}
          />
        </View>
        <View style={styles.label}>
          <Input
            placeholder={"Zip Code"}
            name={"ZipCode"}
            value={zipCode}
            keyboardType={"numeric"}
            onChangeText={(text) => setZipCode(text)}
          />
        </View>
        <View style={styles.label}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.inputSelect}
            data={data}
            labelField="label"
            valueField="value"
            placeholder="Select your country"
            value={country}
            onChange={(item) => setCountry(item.value)}
            containerStyle={{ marginBottom: 20 }}
          />
        </View>
        <View style={{ width: "80%", alignItems: "center", marginBottom: 80 }}>
          <EasyButton medium secondary onPress={() => checkout()}>
            <Text style={{ color: "white" }}>Confirm</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  mainCont: {
    flex: 1,
    backgroundColor: "#FAF9EE",
  },
  title: {
    fontSize: 16,
    alignSelf: "flex-start",
  },
  container: { paddingHorizontal: 10, margin: 10 },
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
  label: {
    width: "80%",
    marginTop: 10,
  },
});

export default Checkout;
