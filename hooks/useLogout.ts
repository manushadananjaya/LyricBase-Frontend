import { useAuthContext } from "./useAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import the correct module

const useLogout = () => {
    const { dispatch } = useAuthContext();

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
    };

    return { handleLogout };
  
};

export { useLogout };



