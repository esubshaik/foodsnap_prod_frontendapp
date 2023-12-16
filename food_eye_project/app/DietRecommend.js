// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, Image,StyleSheet,Dimensions } from 'react-native';

// const ImageGallery = () => {
//   const defaultFoodNames = [
//     'Chapati', 'Roti', 'Garlic Herb Chapati', 'Garlic Herb Roti', 'Rumali Roti', 'Masala Chapati',
//     'Masala Roti', 'Missi Roti', 'Chicken Korma Naan', 'Garlic Coriander Naan', 'Kuloha Naan',
//     'Masala Naan', 'Onion Naan', 'Peshwari Naan', 'Roghani Naan', 'Spicy Tomato Naan', 'Butter Naan',
//     'Tandoon Naan', 'Aloo Paratha', 'Lachcha Paratha', 'Vegetable Paratha', 'Onion Paratha',
//     'Plain Paratha', 'Chicken Tikka Masala', 'Potato Brinjal Curry', 'Potato Beans Curry', 'Aloo Curry',
//     'Mashed eggplant', 'Ladys Finger', 'Chick Peas', 'Methi Aloo', 'Mutter Paneer', 'Pumpkin',
//     'Shahi Paneer', 'Shimla Mirchi Aloo', 'Stuffed Tomato', 'Ridge gound', 'Vegetable Kofta Curry',
//     'Vegetable Korma', 'Pigeon Peas', 'Split Chick Peas', 'Dal Makhani', 'Moong Dal', 'Masoor dal',
//     'Urad dal', 'Sambar', 'White Rice', 'Pulao', 'Kichidi', 'Cow Milk', 'Buffalo Milk', 'Curd',
//     'Butter Milk', 'Paneer', 'Cheese', 'Lassi', 'Samosa', 'Brinjal Pickle', 'Chilli Pickle',
//     'Lime Pickle', 'Mango Pickle', 'Beetroot', 'Bell Pepper', 'Black Olives', 'Broccoli',
//     'Brussels Sprouts', 'Cabbage', 'Carrot', 'Cauliflower', 'Celery', 'Cherry Tomato', 'Corn',
//     'Cucumber', 'Garlic', 'Green Beans', 'Green Olives', 'Green Onion', 'Lettuce', 'Mushrooms',
//     'Onion', 'Peas', 'Potato', 'Pumpkin', 'Radishes', 'Red Cabbage', 'Spinach', 'Sweet Potato',
//     'Tomato', 'Apple', 'Avocado', 'Banana', 'Blackberries', 'Blueberries', 'Cherries',
//     'Custard Apple', 'Dates', 'Grapes', 'Guava', 'Jackfruit', 'Jujube', 'Kiwi', 'Lemon', 'Mango',
//     'Orange', 'Papaya', 'Peach', 'Pear', 'Onion', 'Dal', 'Aloo Gobi', 'Chicken Biryani',
//     'Mutton Biryani', 'Egg Biryani', 'Prawns Biryani', 'Vegetable Biryani', 'Boiled Egg',
//     'Palak Paneer', 'Mint Chutney', 'Coconut Chutney', 'Egg Noodles', 'Veg Noodles', 'Manchurian',
//     'Fried Rice', 'Chicken Fried Rice', 'Chicken Noodles', 'Egg Fried Rice', 'Pani Puri', 'Chaat',
//     'Cake', 'Punugulu', 'Dosa', 'Egg Dosa', 'Idly', 'Mirchi Bajji', 'Vada Recipe', 'Aloo Bajji', 'Butter', 'Puri'
//   ];

//   const [foodNames, setFoodNames] = useState(defaultFoodNames);
//   const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
//   const [currentImages, setCurrentImages] = useState([]);

//   useEffect(() => {
//     // Fetch initial set of images
//     fetchImages();
//   }, [currentFoodIndex]);

//   const fetchImages = async () => {
//     const currentFoodName = foodNames[currentFoodIndex];

//     try {
//       const response = await fetch(`https://query-food-images.onrender.com/get_images?food_name=${currentFoodName}`);
//       const data = await response.json();

//       if (data.error) {
//         console.error(data.error);
//         // Handle error, e.g., show an error message in your UI
//       } else {
//         setCurrentImages(data.images);
//       }
//     } catch (error) {
//       console.error('Error fetching images:', error);
//       // Handle error, e.g., show an error message in your UI
//     }
//   };


//   const handleNext = () => {
//     // Move to the next set of images
//     setCurrentFoodIndex(currentFoodIndex + 1);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.foodName}>Current Food: {foodNames[currentFoodIndex]}</Text>
//       <View style={styles.imageContainer}>
//         {currentImages.map((imageData, index) => (
//           <Image key={index} source={{ uri: `data:image/jpeg;base64,${imageData}` }} style={styles.image} />
//         ))}
//       </View>
//       <Button title="Next" onPress={handleNext} style={styles.button} />
//     </View>
//   );
// };

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;
// const styles = StyleSheet.create({
//   container: {
//     container: {
//       flex: 0,
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: screenHeight * 0.6,
//     },
//   },
//   foodName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 5,
//   },
//   imageContainer: {
//     marginBottom: 20,
//   },
//   image: {
//     width: screenWidth * 0.5, // Set the width to 90% of the screen width
//     height: screenWidth * 0.5, // Set the height to maintain the aspect ratio
//     borderRadius: 8,
//     marginBottom: 8,
//     resizeMode: 'cover',
//     shadowColor: 'rgba(0, 0, 0, 0.5)',
//     shadowOffset: { width: 2, height: 2 },
//     shadowRadius: 5,
//   },
//   button: {
//     shadowColor: 'rgba(0, 0, 0, 0.5)',
//     shadowOffset: { width: 2, height: 2 },
//     shadowRadius: 5,
//   },
// });
// export default ImageGallery;
