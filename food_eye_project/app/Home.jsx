import { View,Text,TouchableOpacity,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Octicons,Zocial,Entypo,FontAwesome5 } from '@expo/vector-icons';
import { t } from 'react-native-tailwindcss';
import { useState } from "react";
import OldHome from './MainHome' ;
import UserMgmt from './UserMgmt';
import Empty from "./EmptyPage";


export default function TabsLayout() {
  const [displayEmoji, setDisplayEmoji] = useState(false);
  const toggleEmojiDisplay = () => {
    setDisplayEmoji(true);

    // Hide the emoji after 2 seconds
    setTimeout(() => {
      setDisplayEmoji(false);
    }, 2000);
  };
  const [view,setview] = useState(1);
  return (
    <View style={[t.wFull, t.flex, t.flexCol, t.hFull]}>
      <View style={[t.h10]}>
      <TouchableOpacity onPress={toggleEmojiDisplay}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', // Added to stretch the header image
              zIndex: 1,
            }}
          >
            <Image
              source={require('./assets/logo-white.png')}
              style={{ width: 130, height: 50 ,left:16}} // Adjust the width
              resizeMode="contain"
            />
          </View>
      </TouchableOpacity>

        <View style={{ position: 'absolute', top: '20%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }], zIndex: 0 }}>
          {displayEmoji && <Text style={{ fontSize: 50, paddingTop: 200 }}>😋</Text>}
        </View>
      </View>
      <View style={[t.flex1]}>
        {view== 1 ? (
          <OldHome/>
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