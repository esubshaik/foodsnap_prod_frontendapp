import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ToastAndroid,ActivityIndicator } from 'react-native';
import { format, endOfMonth } from 'date-fns';
import {t} from 'react-native-tailwindcss' ;
import { AntDesign,Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import HOST_URL from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FoodHistory = ({foodlabels,dates,ids,reloadpage,sploading}) => {
  
  // const foodnames = Array.from(foodlabels).reverse() ;
  const [loading, setloading] = useState(false);
  const foodnames = foodlabels.slice().reverse();
  const fooddate = dates.slice().reverse();
  const foodids = ids.slice().reverse();

  
    const DeleteFood=async(itemid)=>{
        setloading(true);
        const token = await AsyncStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json' },
            body: JSON.stringify({ itemid: itemid })
          };
          try {
            await fetch(
              HOST_URL+'/api/user/delete-nutridata', requestOptions)
              .then(response => {
                response.json()
                  .then(data => {
                    // console.log(data.message);
                    
                  });
              })
      
          }
          catch (error) {
            // console.log(error);
          }
          finally{
            await reloadpage();
            setloading(false);
          }
    }
    const handleItemDelete = async(itemid)=>{
        Alert.alert(
            '',
            'Are you sure to delete the food item',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => DeleteFood(itemid),
              },
            ],
            { cancelable: false }
          );
    }
    const [histlimit,sethistlimit] = useState(3);
    const totalhist = foodnames.length ;

  return (
    <View style={styles.container}>
    <View style={[t.flex,t.flexRow,t.justifyCenter,t.mT4]}>
      <View style={[t.flex,t.flexCol,t.wFull,t.pX3]}>
        <Text style={[t.textBlack,t.textBase,t.fontSemibold,t.mB2,t.pT1]}>🕛 Intake History</Text>
        {
          loading || sploading ? <ActivityIndicator size="large" color='#294D61'/> :
          <View style={[t.textBlack,t.flexCol, t.roundedSm,t.border]}>
            {
            foodnames.map((name,index)=>(
            index < histlimit ? (
<View style={[t.flexRow, t.justifyBetween,  t.itemsCenter, [index%2 == 0 ? t.bgWhite: t.bgTransparent ], t.p1, t.h16,t.borderB]} key={index}>
            <View style={[t.flexCol]}>
            <Text style={[t.fontSemibold, t.textGray900]}>✅ {name}</Text>
            <Text style={[t.mL4,t.mT1]}>{new Date(fooddate[index]).toString()}</Text>
            </View>
            <TouchableOpacity onPress={()=>handleItemDelete(foodids[index])}><Ionicons name="trash-outline" size={25} color="#e11d48" style={[t.mL4,t.fontBold,t.mR1]}/></TouchableOpacity>
         
            </View>
            ) : null
                )) 
            }
            
        </View>
        }
        
      </View>
   
    </View>
        {
            histlimit <= 3 ?  <TouchableOpacity onPress={()=>sethistlimit(totalhist)}>
            <Text style={[t.fontSemibold,t.textBase, t.textWhite, t.bgTeal800, t.p2,t.wFull,t.h10,t.textCenter,t.roundedBFull,t.mT4,t.selfCenter]}>View all</Text>
        </TouchableOpacity>  : 
        histlimit > 3 ?
        <TouchableOpacity onPress={()=>sethistlimit(3)}>
        <Text style={[t.fontSemibold,t.textBase, t.textWhite, t.bgTeal800, t.p2,t.wFull,t.h10,t.textCenter,t.roundedBFull,t.mT4,t.selfCenter]}>Collapse</Text>
    </TouchableOpacity>
        : null
        }
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#eff6ff',shadowColor: '#05161A',shadowOpacity: 0.9,borderTopEndRadius : 10,borderTopStartRadius: 10,borderBottomEndRadius: 40,borderBottomStartRadius: 40,
      shadowRadius: 4,elevation: 5, marginLeft:18, marginRight:18, paddingTop:12, marginTop:14,marginBottom: 30
    },
  });

export default FoodHistory;
