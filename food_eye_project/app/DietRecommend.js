import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image,StyleSheet,Dimensions} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {t} from 'react-native-tailwindcss' ;

const ImageGallery = () => {
  const defaultFoodNames = [
    'Chapati', 'Roti', 'Garlic Herb Chapati', 'Garlic Herb Roti', 'Rumali Roti', 'Masala Chapati',
    'Masala Roti', 'Missi Roti', 'Chicken Korma Naan', 'Garlic Coriander Naan', 'Kuloha Naan',
    'Masala Naan', 'Onion Naan', 'Peshwari Naan', 'Roghani Naan', 'Spicy Tomato Naan', 'Butter Naan',
    'Tandoon Naan', 'Aloo Paratha', 'Lachcha Paratha', 'Vegetable Paratha', 'Onion Paratha',
    'Plain Paratha', 'Chicken Tikka Masala', 'Potato Brinjal Curry', 'Potato Beans Curry', 'Aloo Curry',
    'Mashed eggplant', 'Ladys Finger', 'Chick Peas', 'Methi Aloo', 'Mutter Paneer', 'Pumpkin',
    'Shahi Paneer', 'Shimla Mirchi Aloo', 'Stuffed Tomato', 'Ridge gound', 'Vegetable Kofta Curry',
    'Vegetable Korma', 'Pigeon Peas', 'Split Chick Peas', 'Dal Makhani', 'Moong Dal', 'Masoor dal',
    'Urad dal', 'Sambar', 'White Rice', 'Pulao', 'Kichidi', 'Cow Milk', 'Buffalo Milk', 'Curd',
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
  const [currentFoodIndex, setCurrentFoodIndex] = useState(5);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    // Fetch initial set of images
    fetchImages();
  }, [currentFoodIndex]);

  const fetchImages = async () => {
    const currentFoodName = foodNames[currentFoodIndex];

    try {
      const response = await fetch(`https://query-food-images.onrender.com/get_images?food_name=${currentFoodName}`);
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        // Handle error, e.g., show an error message in your UI
      } else {
        setCurrentImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      // Handle error, e.g., show an error message in your UI
    }
  };


  const handleNext = () => {
    // Move to the next set of images
    setCurrentFoodIndex(currentFoodIndex + 1);
  };
  const [tab,settab] = useState(1)

  return (
    <View >
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

       <ScrollView contentContainerStyle={[t.mB10]} >
        <View style={[t.w30]}>
       <View style={[t.flex, t.flexRow, t.bgOrange100, t.roundedLg,t.m2,t.border2,t.borderOrange200,t.shadowLg]}>
        <Image source={{ uri: `data:image/jpeg;base64,${currentImages[3]}` }} style={styles.image} />
        <View style={[t.justifyCenter,t.mX6,t.flex1]}>
        <Text style={[t.fontSemibold,t.textLg, t.mB2]}>{foodNames[currentFoodIndex]}</Text>
        <Text>Chapati contains whole wheat flour, water, and salt, forming a simple unleavened flatbread staple in Indian cuisine.</Text>
        </View>
        </View>
        </View>
        <View style={[t.w30]}>
       <View style={[t.flex, t.flexRow, t.bgOrange100, t.roundedLg,t.m2,t.border2,t.borderOrange200,t.shadowLg]}>
        <Image source={{ uri: `data:image/jpeg;base64,${currentImages[3]}` }} style={styles.image} />
        <View style={[t.justifyCenter,t.mX6,t.flex1]}>
        <Text style={[t.fontSemibold,t.textLg, t.mB2]}>{foodNames[currentFoodIndex]}</Text>
        <Text>Chapati contains whole wheat flour, water, and salt, forming a simple unleavened flatbread staple in Indian cuisine.</Text>
        </View>
        </View>
        </View>

        <Button title="Next" onPress={handleNext} style={styles.button} />
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
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
  },
});
export default ImageGallery;
