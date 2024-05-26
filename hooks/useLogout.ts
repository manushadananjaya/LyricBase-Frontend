import { useAuthContext } from "./useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PartialRoute, Route, useNavigation } from "@react-navigation/native";

const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });

      console.log("User logged out", await AsyncStorage.getItem("user"));

      // Clear navigation history and redirect to sign-in
      navigation.reset({
        index: 0,
        routes: [
          { name: "(auth)" } as PartialRoute<Route<never, object | undefined>>,
        ],
      });
    } catch (error) {
      console.error("Failed to logout user", error);
    }
  };

  return { handleLogout };
};

export { useLogout };
