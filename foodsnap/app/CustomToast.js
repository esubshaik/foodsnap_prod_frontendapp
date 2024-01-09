import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { FontAwesome } from '@expo/vector-icons';

const CustomToast = ({ message, duration = 2000, onClose }) => {
    const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: (Dimensions.get('window').width / 2) + 60,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: Dimensions.get('window').width,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onClose) onClose();
            });
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [slideAnim, opacityAnim, duration, onClose]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    ...styles.toastContainer,
                    transform: [{ translateX: slideAnim }],
                    opacity: opacityAnim,
                    flexDirection:'row',
                    alignItems:'center',
                    borderLeftWidth:4,
                    borderLeftColor:'green',
                    borderRadius:16,
                    backgroundColor:'green'

                }}
            >
                
                
                <FontAwesome name="check-circle" size={24} color="white"  />
                <Text style={[t.mL2,t.textWhite,t.fontSemibold,t.textLg]}>{message}</Text>
                <View style={[t.flexCol]}>
                    
                    {/* <Text style={[t.mL2,t.textBlack,t.fontBold,t.textXs]}>updated successfully</Text> */}
                    </View>
          
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        zIndex: 999, // Set a higher z-index
    },
    toastContainer: {
        backgroundColor: 'white',
        padding: 4,
        position: 'absolute',
        marginTop:12,
        bottom: 14,
        top: 0,
        left: 0,
        right: 0,
        shadowColor: 'black', shadowOpacity: 0.9,
          shadowRadius: 10, elevation: 10,
    },
    toastText: {
        color: 'black',
        backgroundColor:'green'
    },
});

export default CustomToast;