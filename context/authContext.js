import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
      };
    case "UPDATE_ACCESS_TOKEN":
      return {
        ...state,
        user: {
          ...state.user,
          accessToken: action.payload,
        },
      };
    case "LOADING_COMPLETE":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          dispatch({ type: "LOGIN", payload: user });
        } else {
          dispatch({ type: "LOADING_COMPLETE" });
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
        dispatch({ type: "LOADING_COMPLETE" });
      }
    };

    loadUser();
  }, []);

  console.log("auth state", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
