import { View,Text,TouchableOpacity,Image,BackHandler } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Octicons,Zocial,Entypo,FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';
import { useState,useEffect } from "react";
import MainHome from './MainHome' ;
import UserMgmt from './UserMgmt';
import Empty from "./EmptyPage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons,SimpleLineIcons } from '@expo/vector-icons';


export default function TabsLayout(){
  const [username, setUsername] = useState("");

  const checkUserSession = async () => {
    const user = await AsyncStorage.getItem('name');
    setUsername(user);
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // This will exit the app
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {
    checkUserSession();
  }, []);
  const [displayEmoji, setDisplayEmoji] = useState(false);
  const toggleEmojiDisplay = () => {
    setDisplayEmoji(true);

    setTimeout(() => {
      setDisplayEmoji(false);
    }, 2000);
  };
  const [view,setview] = useState(1);
  return (
    <View style={[t.wFull, t.flex, t.flexCol, t.hFull,t.bg=['#F5F5F4']]}>
      <View style={[t.h16]}>
        <View style={[t.flex, t.flexRow,t.m1,t.justifyBetween]}>
      
          <View style={[t.flex, t.flexRow]}>
          <Image
              source={require('./assets/defaultuser.png')}
              style={{ width: 45, height: 45 ,margin:8}} // Adjust the width
              resizeMode="contain"
            />
            <View style={[t.flex, t.flexCol, t.w40,t.h45,t.selfCenter,t.textGray200]}>
            <View style={[t.flex, t.flexRow]}>
            <Image
              source={require('./assets/Levels/bronze.png')}
              style={{ width:15, height: 15,marginRight:4}} // Adjust the width
              resizeMode="contain"
            />
            <Text style={[t.fontBold,t.textSm,t.textGray800]}>Bronze III</Text>
            </View>
            <View style={[t.h14,t.mT1,t.flex, t.flexRow]}>
            <Text style={[t.fontBold,t.textSm,t.textGray800]}>👋 Welcome </Text>
            <Text style={[t.fontBold,t.textSm,t.textGray600]}>{username} !</Text>
            </View>
          </View>
          </View>
      

          
          <View style={[t.m4]}>
          <Ionicons name="md-notifications-outline" size={24} color="black" />
          </View>
          <View style={[t.m4]}>
          <SimpleLineIcons name="options-vertical" size={24} color="black" />
          </View>
          
        </View>
      
        <View style={{ position: 'absolute', top: '20%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }], zIndex: 0 }}>
          {displayEmoji && <Text style={{ fontSize: 50, paddingTop: 200 }}>😋</Text>}
        </View>
      </View>
      <View style={[t.flex1]}>
        {view== 1 ? (
          <MainHome/>
        ):
        view==4 ?
       (
          <UserMgmt/>
        )
        :
        (
          
          <Empty/>
        
        ) 
      }
       
      </View>

      <View style={[t.wFull, t.h16, t.bgGray100, t.bottom0, t.flex, t.flexRow, t.pT4, t.pB3,t.justifyBetween,t.pL10,t.pR10]}>
  <TouchableOpacity onPress={() => setview(1)} style={[t.mR6, view === 1 ? t.borderB2 : null]}>
    <Octicons name="home" size={25} color="black" style={[t.pT1]} />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setview(2)} style={[t.mL6, t.mR6, view === 2 ? t.borderB2 : null]}>
    <Zocial name="plancast" size={25} color="black" />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setview(3)} style={[t.mL6, t.mR6, view === 3 ? t.borderB2 : null]}>
    <Entypo name="book" size={25} color="black" style={[t.pT1]} />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setview(4)} style={[t.mL6, view === 4 ? t.borderB2 : null]}>
    <FontAwesome5 name="user" size={24} color="black" style={[t.pT1]} />
  </TouchableOpacity>
</View>

    </View>
  );
}
// export default TabsLayout ;