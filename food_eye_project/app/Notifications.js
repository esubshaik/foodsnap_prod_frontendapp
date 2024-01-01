// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, Switch } from 'react-native';
// import { t } from 'react-native-tailwindcss';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Input,InputField,InputSlot,InputIcon } from '@gluestack-ui/themed';
// import { AntDesign } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';

// function Notifications() {
//   const navigation = useRouter();

//   const handleBack=()=>{
//    navigation.push('/Home');
//   }

//   // useEffect(() => {
//   //   const backAction = () => {
//   //   //   BackHandler.exitApp(); // This will exit the app

//   //     return true;
//   //   };

//   //   BackHandler.addEventListener('hardwareBackPress', backAction);

//   //   return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
//   // }, []);
// const [isEnabled, setIsEnabled] = useState(false);

// const toggleSwitch = () => {
//   setIsEnabled((previousState) => !previousState);
// };

//   return (
//     <View> 
//       <View style={[t.h18, t.shadowLg, t.bgWhite, t.borderB2, t.borderGray300,t.pB2]}>
//     <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
//       <View style={[t.mT4,t.mL4,t.flexRow]}>
//         <TouchableOpacity onPress={handleBack}>
//     <Feather name="arrow-left" size={26} color="black" style={[t.bgBlue200, t.p1,t.roundedFull]} />
//     </TouchableOpacity>
//   <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mL3,t.mT2]}>Notifications</Text>
//   </View>
//     </View>
//   </View>
//     <ScrollView contentContainerStyle={{ backgroundColor: 'white', marginLeft:20 }}>
//     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//       <Text style={[t.textBase]}>Enable Push Notifications:</Text>
//       <Switch
//     trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
//     thumbColor={isEnabled ? 'darkgreen' : '#f4f3f4'}
//     ios_backgroundColor="#81b0ff"
//     onValueChange={toggleSwitch}
//     value={isEnabled}
//   />
//     </View>
//     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//   <Text style={[t.textBase]}>Enable Food Allergen Alerts:</Text>
//   <Switch
//     trackColor={{ false: '#B4CCB9', true: 'skyblue' }}
//     thumbColor={isEnabled ? 'darkgreen' : '#f4f3f4'}
//     ios_backgroundColor="#81b0ff"
//     onValueChange={toggleSwitch}
//     value={isEnabled}
//   />
// </View>

//     </ScrollView>
//     </View>
//   );
// }

// export default Notifications;


import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken,notifyparams) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: '⏰ 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝗮 𝗙𝗼𝗼𝗱𝗦𝗻𝗮𝗽 𝗨𝗽𝗱𝗮𝘁𝗲! ⏰',
    body: "🍎 Don't forget to log your latest meal. Your journey to a healthier lifestyle starts with every entry. 🌿",
    data: { someData: '' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: 'teal',
  });

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token.data;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const notifyarr = [
    {
      title: '⏰ 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝗮 𝗙𝗼𝗼𝗱𝗦𝗻𝗮𝗽 𝗨𝗽𝗱𝗮𝘁𝗲! ⏰',
      body: "🍎 Don't forget to log your latest meal. Your journey to a healthier lifestyle starts with every entry. 🌿",
    },
    {
      title: '⚡ 𝗤𝘂𝗶𝗰𝗸 𝗨𝗽𝗱𝗮𝘁𝗲: 𝗠𝗲𝗮𝗹 𝗧𝗶𝗺𝗲! ⚡',
      body: "🥗 Don't miss out on recording your latest meal. Each entry counts towards a healthier lifestyle journey. 🥦 ",
    },
    {
      title: '🍇 𝗙𝗼𝗼𝗱𝗦𝗻𝗮𝗽 𝗔𝗹𝗲𝗿𝘁: 𝗧𝗶𝗺𝗲 𝘁𝗼 𝗟𝗼𝗴! 🍇 ',
      body: "🥑 Your meal log awaits! Make every entry count on your path to a healthier and happier you. 🏋️‍♀️",
    },
  ];

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>

      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken, notifyarr);
        }}
      />
    </View>
  );
}
