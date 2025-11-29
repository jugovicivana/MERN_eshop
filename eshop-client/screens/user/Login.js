import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import FormContainer from "../../shared/form/FormContainer";
import Input from "../../shared/form/Input";
import Error from "../../shared/Error";
import { Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../context/actions/Auth.actions";
import EasyButton from "../../shared/StyledComponents/EasyButton";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { stateUser, dispatch } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        if (stateUser.isAuthenticated === true) {
          props.navigation.navigate("User Profile");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };
    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      setError();
      console.log("success");
      loginUser(user, dispatch);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator animating={true} size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FormContainer title="Login">
        <Input
          placeholder={"Enter Email"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder={"Enter Password"}
          name={"password"}
          id={"password"}
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={StyleSheet.buttonGroup}>
          {error ? <Error message={error} /> : null}
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={{ color: "white" }}>Login</Text>
          </EasyButton>
        </View>
        <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
          <Text variant="labelSmall" style={styles.middleText}>
            Don't have an account yet?
          </Text>
          <EasyButton
            large
            secondary
            onPress={() => props.navigation.navigate("Register")}
          >
            <Text style={{ color: "white" }}>Register</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
    color: "#708993",
  },
  loginButton: {
    paddingVertical: 5,
    marginTop: 10,
  },
  backButton: {
    margintop: 10,
  },
  backButtonText: {
    color: "#6D94C5", // Boja teksta
  },
  subContainer: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default Login;
