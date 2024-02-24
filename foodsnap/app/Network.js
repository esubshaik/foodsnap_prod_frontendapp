import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ToastAndroid, BackHandler, StyleSheet, Alert, Image } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, InputField, InputSlot, InputIcon } from '@gluestack-ui/themed';
import { AntDesign } from '@expo/vector-icons';
import ImageUpload from './ImageUpload';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5, FontAwesome, Entypo } from '@expo/vector-icons';
import UserMgmtModal from './UserMgmtModal';
import ImageOpener from './ImageOpener';

function Community({ users }) {

  const [UModelVisible, setUModelVisible] = useState(false);
  const [ItemIndex, setItemIndex] = useState(0);
  const [ItemName, setItemName] = useState("");

  const openUModal = async (index, itemname) => {
    setItemIndex(index);
    setUModelVisible(true);
    setItemName(itemname);
  };

  const closeUModal = async () => {
    setItemIndex(null);
    setUModelVisible(false);
    setItemName("");
  };

  // console.log(users) 
  const getDate = (datestring) => {
    const originalDate = new Date(datestring);

    const formattedDate = originalDate.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  }
  const image = Image.resolveAssetSource(require('./assets/defaultuser.png'));
  return (
    <View>
      <View style={[t.hFull, t.bgGray100]}>
        <View style={[t.h16, t.shadowLg, t.bgGray100, t.borderB2, t.borderGray300]}>
          <View style={[t.flex, t.flexRow, t.m1, t.textCenter, t.justifyStart, t.wFull]}>
            <Text style={[t.fontBold, t.text2xl, t.textBlack, t.mT4, t.mL4]}>Community</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ backgroundColor: '#F7FCFF' }}>
          <View style={[t.p1, t.bgWhite, t.flex, t.textCenter, t.flexCol, t.bgGray100, t.m2]}>
            <TouchableOpacity style={[t.bgTeal800, t.w48, t.mY2, t.itemsCenter, t.roundedLg]}>
              <Text style={[t.textWhite, t.textBase, t.p2]}>Community Stats and Ranking</Text>
            </TouchableOpacity>
            {/* <View style={[t.bgWhite,t.border,t.borderGray700,t.roundedSm,t.wFull]}>
            <View style={[t.flexRow,t.justifyBetween]}>
                <Text style={[t.fontSemibold,t.textBase,t.textGray700,t.borderR,t.p4,t.textCenter]}>User</Text>
                <Text style={[t.fontSemibold,t.textBase,t.textGray700,t.borderR,t.p4]}>Ranking</Text>
                <Text style={[t.fontSemibold,t.textBase,t.textGray700,t.borderR,t.p4]}>Achievement Score</Text>
            </View>
        </View> */}
            {
              users.map((user, index) => (parseInt(user.nstatus) === 1  &&
                <View style={[t.bgGray100, t.h30]} key={index}>
                  <View style={[t.p4, t.flex, t.flexRow, t.textCenter, t.itemsCenter, t.border2, t.borderGray200, t.mX2, t.mY2, t.roundedLg, t.bgWhite]}>
                    <Image source={{ uri: image.uri }} style={{ width: 70, height: 70, borderRadius: 50 }} />
                    <View style={[t.flex, t.flexCol, t.mX4, t.itemsStart]}>
                      <Text style={[t.fontExtrabold, t.textBase, t.textGray600]}>{user.name} </Text>
                      <Text style={[t.textGray600]}>Achievement Points: {user.points}</Text>
                      <Text style={[t.textGray600]}>User Since: {getDate(user.createdAt)}</Text>
                    </View>
                    <Text>🏆{index+1}</Text>
                  </View>
                </View>
              ))
            }

          </View>
        </ScrollView>

      </View>

    </View>
  );
}

export default Community;
