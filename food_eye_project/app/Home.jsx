import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home() {
  const navigation = useRouter();
  const [username, setUsername] = useState("");
  const [displayEmoji, setDisplayEmoji] = useState(false);

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await AsyncStorage.getItem('name');
      setUsername(user);
    };

    checkUserSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    ToastAndroid.show('Logged out Successfully!', ToastAndroid.LONG);
    navigation.push('/Login');
  };

  const toggleEmojiDisplay = () => {
    setDisplayEmoji(true);

    // Hide the emoji after 2 seconds
    setTimeout(() => {
      setDisplayEmoji(false);
    }, 2000);
  };

  useEffect(() => {
    let timer;

    if (displayEmoji) {
      timer = setTimeout(() => {
        setDisplayEmoji(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [displayEmoji]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, backgroundColor: 'white' }}>
      <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol, t.pB100]}>
        {/* Custom Header */}
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

        {/* Emoji Display */}
        <View style={{ position: 'absolute', top: '70%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }], zIndex: 0 }}>
          {displayEmoji && <Text style={{ fontSize: 50, paddingTop: 200 }}>😋</Text>}
        </View>

        <Text style={{ fontSize: 20, paddingTop: 50, alignSelf:"center",marginTop:20 }}>Hello {username} !</Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ width: '40%', height: '16%', marginTop: '4%',padding:10, alignSelf: 'center', marginTop: '6%', backgroundColor: '#EC0444', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { navigation.push("/Camera") }}
          style={{ width: '40%', height: '18%',padding:10, marginTop: '4%', alignSelf: 'center', marginTop: '6%', backgroundColor: '#EC0444', borderRadius: 20, justifyContent: 'center', alignItems: 'center', flex: 1 }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 18 }}>Scan my Food</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Home;
