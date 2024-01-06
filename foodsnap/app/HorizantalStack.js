import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, Image } from 'react-native';

const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

const HorizontalStackPage = () => {
    const [currentPage, setCurrentPage] = useState(0);

    const cards = [
        {
            img: (
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./assets/dietmonitoring.png')}
                        style={styles.img}
                        resizeMode="contain"
                    />
                </View>
            ),
            title: 'Diet Monitoring',
            content: <Text>
          Easily Monitor your diet with accurate and detailed
          insights into your nutritional intake
            </Text>,
            
            color: '#ffffff',
        },
        {
            img: (
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./assets/nutriguidance.png')}
                        style={styles.img}
                        resizeMode="contain"
                    />
                </View>
            ),
            title: 'Nutrition Guidance',
            content: <Text>
            Receive personalized nutrition guidance based on your unique profile
          and dietary goals
            </Text>,
            color: '#ffffff',
        },
        {
            img: (
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./assets/instantallerts.png')}
                        style={styles.img}
                        resizeMode="contain"
                    />
                </View>
            ),
            title: <Text>Instant Alerts</Text>,
            content: "Stay informed about your meal timings and warnings about food allergens ",
            color: '#ffffff',
        },
    ];

    const scrollToCard = (cardNumber) => {
        if (scrollViewRef.current) {
            const offsetX = cardNumber * Dimensions.get('window').width;
            scrollViewRef.current.scrollTo({ x: offsetX, animated: true });
        }
    };

    const handleCardChange = () => {
        const nextCard = (currentPage + 1) % cards.length;
        setCurrentPage(nextCard);
        scrollToCard(nextCard);
    };

    useInterval(handleCardChange, 5000);

    const scrollViewRef = useRef();

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={() => {
                    // Handle any additional logic when scrolling ends if needed
                }}
            >
                {cards.map((card, index) => (
                    <View key={index} style={[styles.card, { backgroundColor: card.color }]}>
                        {card.img}
                        <Text style={styles.title}>{card.title}</Text>
                        <Text style={styles.content}>{card.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.dotsContainer}>
                {cards.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.dot, { opacity: index === currentPage ? 1 : 0.5 }]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // height:'70%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: Dimensions.get('window').width,
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop:20
    },
    content: {
        fontSize: 16,
        width: Dimensions.get('window').width - 100,
        // textAlign: 'left',
        textAlign:'center',
        fontWeight:'bold',
        color:'gray',
        
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#888',
        marginHorizontal: 5,
    },
    imageContainer: {
        width: Dimensions.get('window').width - 0,
        height: 250,
    },
    img: {
        flex: 1,
        width: null,
        height: null,
        marginRight:10,
        resizeMode: 'contain',
    },
});

export default HorizontalStackPage;
