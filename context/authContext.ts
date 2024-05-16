import React, {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the User interface
interface User {
  accessToken: string;
  [key: string]: any;
}

// Define the shape of the AuthState
interface AuthState {
  user: User | null;
}

// Define the AuthAction types
interface AuthAction {
  type: "LOGIN" | "LOGOUT" | "UPDATE_ACCESS_TOKEN";
  payload?: any;
}

// Initial state for the context
const initialState: AuthState = {
  user: null,
};

// Create the AuthContext with default values
export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function to handle state changes
export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
      };
    case "UPDATE_ACCESS_TOKEN":
      if (state.user) {
        return {
          ...state,
          user: {
            ...state.user,
            accessToken: action.payload,
          },
        };
      }
      return state;
    default:
      return state;
  }
};

// Define props for the AuthContextProvider
interface AuthContextProviderProps {
  children: ReactNode;
}

// Create the AuthContextProvider component
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          dispatch({ type: "LOGIN", payload: JSON.parse(user) });
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
      }
    };

    loadUser();
  }, []);

  // Log the state for debugging purposes
  console.log("auth state", state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
