import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function checkProfileStatus() {
    try {
      const bmi_saved = await AsyncStorage.getItem('bmi');
      if (!parseInt(bmi_saved)) {
        return true ;
      }
      else {
        return false ;
      }
    } catch (error) {
        return false ;
    }
  }