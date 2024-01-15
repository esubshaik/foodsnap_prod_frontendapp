// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';

// const CustomToast = ({ message, duration = 2000, onClose }) => {
//     const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
//     const opacityAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.parallel([
//             Animated.timing(slideAnim, {
//                 toValue: Dimensions.get('window').height - 100,
//                 duration: 500,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(opacityAnim, {
//                 toValue: 1,
//                 duration: 500,
//                 useNativeDriver: true,
//             }),
//         ]).start();

//         const timer = setTimeout(() => {
//             Animated.parallel([
//                 Animated.timing(slideAnim, {
//                     toValue: Dimensions.get('window').height,
//                     duration: 500,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(opacityAnim, {
//                     toValue: 0,
//                     duration: 500,
//                     useNativeDriver: true,
//                 }),
//             ]).start(() => {
//                 if (onClose) onClose();
//             });
//         }, duration);

//         return () => {
//             clearTimeout(timer);
//         };
//     }, [slideAnim, opacityAnim, duration, onClose]);

//     return (
//         <View style={styles.container}>
//             <Animated.View
//                 style={{
//                     ...styles.toastContainer,
//                     transform: [{ translateY: slideAnim }],
//                     opacity: opacityAnim,
//                 }}
//             >
//                 <View style={styles.toastContent}>
//                     <FontAwesome name="check-circle" size={24} color="white" />
//                     <Text style={[styles.toastText]}>{message}</Text>
//                 </View>
//             </Animated.View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         ...StyleSheet.absoluteFillObject,
//         justifyContent: 'flex-end',
//         zIndex: 999, // Set a higher z-index
//     },
//     toastContainer: {
//         backgroundColor: 'green',
//         padding: 12,
//         borderRadius: 8,
//         marginHorizontal: 16,
//         marginBottom: 16,
//         shadowColor: 'black',
//         shadowOpacity: 0.9,
//         shadowRadius: 10,
//         elevation: 10,
//     },
//     toastContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     toastText: {
//         marginLeft: 8,
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default CustomToast;
