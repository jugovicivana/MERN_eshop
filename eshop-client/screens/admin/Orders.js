import React, { useState, useCallback } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderCard from "../../shared/OrderCard";

const Orders = (props) => {
  const [orderList, setOrderList] = useState();
  const [token, setToken] = useState();

 useFocusEffect(
    useCallback(() => {
      let isActive = true;

      // prvo dohvatimo token, pa tek onda dohvatimo narudžbe
      AsyncStorage.getItem("jwt")
        .then((res) => {
          if (isActive && res) {
            setToken(res);
            // odmah pozivamo getOrders s tokenom
            getOrders(res);
          }
        })
        .catch((err) => console.log(err));

      return () => {
        isActive = false;
        setOrderList([]);
        setToken(null);
      };
    }, [])
  );

  const getOrders = (jwtToken) => {
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    axios
      .get(`${baseURL}orders`, config)
      .then((res) => {
        setOrderList(res.data);
      })
      .catch((err) => console.log("Error loading orders:", err));
  };
  return (
    <View style={{backgroundColor:'white'}}>
      <FlatList
        data={orderList}
        keyExtractor={(item) => item._id} // obavezno unique key
        renderItem={({ item }) => <OrderCard navigation={props.navigation} {...item} editMode={true}/>}
      />
    </View>
  );
};

export default Orders;
