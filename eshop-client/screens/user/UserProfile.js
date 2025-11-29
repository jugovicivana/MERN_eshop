import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import {
  Appbar,
  Searchbar,
  IconButton,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import OrderCard from "../../shared/OrderCard";

import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import EasyButton from "../../shared/StyledComponents/EasyButton";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

import { logoutUser } from "../../context/actions/Auth.actions";

const UserProfile = (props) => {
  const { stateUser, dispatch } = useAuth();
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      if (stateUser.isAuthenticated === false) {
        props.navigation.navigate("Login");
        return;
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
            .get(`${baseURL}users/${stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => {
              setUserProfile(user.data);
              setLoading(false);
            });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });

      axios
        .get(`${baseURL}orders/`)
        .then((res) => {
          const data = res.data;
          const userOrders = data.filter(
            (order) => order.user._id === stateUser.user.userId
          );
          setOrders(userOrders);
        })
        .catch((err) => console.log(err));

      return () => {
        setUserProfile();
        setOrders();
      };
    }, [stateUser.isAuthenticated])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator animating={true} size="large" color="#0000ff" />
        {/* <Text style={styles.loadingText}>Loading your profile...</Text> */}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{ fontSize: 30 }}>
          {userProfile ? userProfile.name : ""}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ margin: 10 }}>
            Email: {userProfile ? userProfile.email : ""}
          </Text>
          <Text style={{ margin: 10 }}>
            Phone: {userProfile ? userProfile.phone : ""}
          </Text>
        </View>
        <View style={{ marginTop: 80 }}>
          <EasyButton
            large
            danger
            onPress={() => {
              AsyncStorage.removeItem("jwt");
              logoutUser(dispatch);
            }}
          >
            <Text style={{ color: "white" }}>Sign Out</Text>
          </EasyButton>
        </View>
        <View style={styles.order}>
          <Text style={{ fontSize: 20 }}>My Orders</Text>
          <View style={{}}>
            {orders && orders.length > 0 ? (
              orders.map((x) => {
                return <OrderCard key={x._id} {...x} />;
              })
            ) : (
              <View style={styles.order}>
                <Text>You have no orders!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  subContainer: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor:'white'
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
   order:{
    marginTop:20,
    alignItems:'center',
    marginBottom:60,
    
  }
});

export default UserProfile;
