import { useAuthContext } from "./useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import the correct module
import { PartialRoute, Route, useNavigation } from "@react-navigation/native"; // Import useNavigation

const useLogout = () => {
const { dispatch } = useAuthContext();
const navigation = useNavigation(); // Get the navigation object

const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });

    console.log("User logged out" , AsyncStorage.getItem("user"));

    //clear expo navigation history and redirect to sign-in
    navigation.reset({
        index: 0,
        routes: [{ name: "(auth)" } as PartialRoute<Route<never, object | undefined>>], // Explicitly define the type of the routes array
    });
};

  return { handleLogout };
};

export { useLogout };
