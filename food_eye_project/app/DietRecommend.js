import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image,StyleSheet,Dimensions,ActivityIndicator} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'react-native-tailwindcss' ;

const ImageGallery = () => {
  const defaultFoodNames = [
    'Chapati', 'Roti', 'Garlic Herb Chapati', 'Garlic Herb Roti', 'Rumali Roti', 'Masala Chapati',
    'Masala Roti', 'Missi Roti', 'Chicken Korma Naan', 'Garlic Coriander Naan', 'Kuloha Naan',
    'Masala Naan', 'Onion Naan', 'Peshwari Naan', 'Roghani Naan', 'Spicy Tomato Naan', 'Butter Naan',
    'Tandoon Naan', 'Aloo Paratha', 'Lachcha Paratha', 'Vegetable Paratha', 'Onion Paratha',
    'Plain Paratha', 'Chicken Tikka Masala', 'Potato Brinjal Curry', 'Potato Beans Curry', 'Aloo Curry',
    'Mashed Eggplant', 'Ladys Finger', 'Chick Peas', 'Methi Aloo', 'Mutter Paneer', 'Pumpkin',
    'Shahi Paneer', 'Shimla Mirchi Aloo', 'Stuffed Tomato', 'Ridge Gourd', 'Vegetable Kofta Curry',
    'Vegetable Korma', 'Pigeon Peas', 'Split Chick Peas', 'Dal Makhani', 'Moong Dal', 'Masoor Dal',
    'Urad Dal', 'Sambar', 'White Rice', 'Pulao', 'Kichidi', 'Cow Milk', 'Buffalo Milk', 'Curd',
    'Butter Milk', 'Paneer', 'Cheese', 'Lassi', 'Samosa', 'Brinjal Pickle', 'Chilli Pickle',
    'Lime Pickle', 'Mango Pickle', 'Beetroot', 'Bell Pepper', 'Black Olives', 'Broccoli',
    'Brussels Sprouts', 'Cabbage', 'Carrot', 'Cauliflower', 'Celery', 'Cherry Tomato', 'Corn',
    'Cucumber', 'Garlic', 'Green Beans', 'Green Olives', 'Green Onion', 'Lettuce', 'Mushrooms',
    'Onion', 'Peas', 'Potato', 'Pumpkin', 'Radishes', 'Red Cabbage', 'Spinach', 'Sweet Potato',
    'Tomato', 'Apple', 'Avocado', 'Banana', 'Blackberries', 'Blueberries', 'Cherries',
    'Custard Apple', 'Dates', 'Grapes', 'Guava', 'Jackfruit', 'Jujube', 'Kiwi', 'Lemon', 'Mango',
    'Orange', 'Papaya', 'Peach', 'Pear', 'Onion', 'Dal', 'Aloo Gobi', 'Chicken Biryani',
    'Mutton Biryani', 'Egg Biryani', 'Prawns Biryani', 'Vegetable Biryani', 'Boiled Egg',
    'Palak Paneer', 'Mint Chutney', 'Coconut Chutney', 'Egg Noodles', 'Veg Noodles', 'Manchurian',
    'Fried Rice', 'Chicken Fried Rice', 'Chicken Noodles', 'Egg Fried Rice', 'Pani Puri', 'Chaat',
    'Cake', 'Punugulu', 'Dosa', 'Egg Dosa', 'Idly', 'Mirchi Bajji', 'Vada Recipe', 'Aloo Bajji', 'Butter', 'Puri'
  ];

  const [foodNames, setFoodNames] = useState(defaultFoodNames);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [temp,settemp] = useState('null');
  var findex = 0 ;

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    for(var i = currentFoodIndex; i < currentFoodIndex+ 10 && i < foodNames.length ; i++){

    const currentFoodName = foodNames[i]; 
    console.log(currentFoodName);
    try {
      const response = await fetch(`https://query-food-images.onrender.com/get_images?food_name=${currentFoodName}`);
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        break ;
        // Handle error, e.g., show an error message in your UI
      } else {
        const oneImg = await data.images[1];
        setCurrentImages((old) => [...old, oneImg]);
        findex+=1 ;
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }
  setCurrentFoodIndex(currentFoodIndex+10);
  setLoading(false);
  };


  const handleNext = () => {
    // Move to the next set of images
    fetchImages();
  };
  const [tab,settab] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <View style={[t.flex1]}>
      <View style={[t.h16, t.shadowLg, t.bgWhite, t.borderB2, t.borderGray300]}>
        <View style={[t.flex, t.flexRow,t.m1, t.textCenter,t.justifyStart, t.wFull]}>
      <Text style={[t.fontBold, t.text2xl, t.textBlack,t.mT4,t.mL4]}>Diet Recommendations</Text>
        </View>

      </View>
      <View style={[t.flex, t.flexRow,t.m2]}>
       <TouchableOpacity onPress={()=>settab(1)} style={[t.p2,t.mX2,t.roundedLg,t.borderTeal800,t.border2, tab == 1 ? t.bgTeal800 : [t.bgWhite]]}>
          <Text style={[t.textBase, tab==1 ? t.textWhite : t.textTeal900]}>Suggested Foods</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>settab(2)} style={[t.p2,t.mX2,t.bgTeal800,t.borderTeal800,t.border2,t.roundedLg,tab == 2 ? t.bgTeal800 : t.bgWhite]}>
          <Text style={[t.textBase,tab==2 ? t.textWhite : t.textTeal900]}>Meal Plans</Text>
       </TouchableOpacity>
       </View>

       <ScrollView contentContainerStyle={{ flexGrow: 1 , minHeight: '100%', paddingBottom:30 }}>
        <View>
        {
          currentImages.map((img,index)=>(
            <View style={[t.w30]} key={index}>
            <View style={[t.flex, t.flexRow, t.bgOrange100, t.roundedLg,t.m2,t.border2,t.borderOrange200,t.shadowLg]}>
             <Image source={{ uri: `data:image/jpeg;base64,${img}` }} style={styles.image} />
             <View style={[t.justifyCenter,t.mX6,t.flex1]}>
             <Text style={[t.fontSemibold,t.textLg, t.mB2]}>{foodNames[index]}</Text>
             <Text>Chapati contains whole wheat flour, water, and salt, forming a simple unleavened flatbread staple in Indian cuisine.</Text>
             </View>
             </View>
             </View>
          ))
        }
        </View>
      
      <TouchableOpacity onPress={handleNext} style={[t.w20,t.h8, t.bgTeal800,t.roundedLg,t.justifyCenter,t.selfEnd,t.m4]} disabled={loading} >
     
        <Text style={[t.textXl, t.textWhite, t.fontSemibold, t.textCenter]}>
        { loading ?
      (
      <ActivityIndicator size="small" color='white'/> ): (<>Next</>)
       }
          
          </Text>
      </TouchableOpacity>
       </ScrollView>


    </View>
 
  );
};

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
 
  image: {

    width:120,
    height:120,
    borderRadius: 10,
    margin:8,
  },
  button: {
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    // shadowOffset: { width: 2, height: 2 },
    // shadowRadius: 5,
    width:10,
    height:5
  },
});
export default ImageGallery;
