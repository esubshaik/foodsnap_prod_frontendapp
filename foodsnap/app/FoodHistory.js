import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { format, endOfMonth } from 'date-fns';
import {t} from 'react-native-tailwindcss' ;
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const FoodHistory = ({foodlabels,dates,ids,reloadpage}) => {
  // const foodnames = Array.from(foodlabels).reverse() ;
  const foodnames = foodlabels.slice().reverse();
  const fooddate = dates.slice().reverse();
  const foodids = ids.slice().reverse();
    const DeleteFood=async(itemid)=>{
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemid: itemid })
          };
          try {
            await fetch(
              'https://backend-updated-w7a2.onrender.com/api/user/delete-nutridata', requestOptions)
              .then(response => {
                response.json()
                  .then(data => {
                    console.log(data.message);
                    
                  });
              })
      
          }
          catch (error) {
            // console.log(error);
          }
          finally{
            await reloadpage();
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
        <View style={[t.textBlack,t.flexCol, t.roundedSm,t.border]}>
            {
            foodnames.map((name,index)=>(
            index < histlimit ? (
<View style={[t.flexRow, t.justifyBetween,  t.itemsCenter, [index%2 == 0 ? t.bgBlue100 : t.bgWhite], t.p1, t.h16,t.borderB]} key={index}>
            <View style={[t.flexCol]}>
            <Text style={[t.fontSemibold, t.textGray900]}>✅ {name}</Text>
            <Text style={[t.mL4,t.mT1]}>{new Date(fooddate[index]).toString()}</Text>
            </View>
            <TouchableOpacity onPress={()=>handleItemDelete(foodids[index])}>
            <AntDesign name="delete" size={25} color="red" style={[t.mL4,t.fontBold,t.mR1]}/>
            </TouchableOpacity>
            </View>
            ) : null
                )) 
            }
        </View>
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
      backgroundColor:'#FAFAFA',shadowColor: '#05161A',shadowOpacity: 0.4,borderTopEndRadius : 10,borderTopStartRadius: 10,borderBottomEndRadius: 40,borderBottomStartRadius: 40,
      shadowRadius: 4,elevation: 5, marginLeft:18, marginRight:18, paddingTop:12, marginTop:14,marginBottom: 30
    },
  });

export default FoodHistory;
