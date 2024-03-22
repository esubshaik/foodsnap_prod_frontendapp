import React, { useState, useRef, useEffect, StatusBar} from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView, Image,Alert
} from "react-native";
import { Camera } from "expo-camera";
import { Video } from "expo-av";
import * as FileSystem from 'expo-file-system';
import RenderBoundingBoxes from "./DrawBoundings";
import { useRouter } from "expo-router";
import ModalComponent from './ModalClass';
import HOST_URL from "./config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);



export default function ScanFood() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useRouter() ;
  // <StatusBar barStyle="dark-content" />
  const [fitems,setfitems] = useState([]) ;
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const cameraRef = useRef();
  const formData = new FormData();
  const [imageData,setImageData] = useState(null);
  const [anim,setanim] = useState(false);
  const [boolbound,setboolbound] = useState(false);
  const [results,setresults] = useState({});
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const onCameraReady = () => {
    setIsCameraReady(true);
  };


  
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const options = { quality: 0.5, base64: false, skipProcessing: true, format: 'jpeg' };
        const data = await cameraRef.current.takePictureAsync(options);
  
        // Pause the camera preview
        await cameraRef.current.pausePreview();
  
        // Read the image file as binary data
        await FileSystem.readAsStringAsync(data.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setImageData(data.uri);
        // Create a FormData object
        
      } catch (error) {
        // console.error('Error taking or processing the picture:', error);
      }
    }
  };



  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            // console.log("video source", source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };
  const stopVideoRecording = () => {
    if (cameraRef.current) {
      setIsPreview(false);
      setIsVideoRecording(false);
      cameraRef.current.stopRecording();
    }
  };
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };


  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setVideoSource(null);
    setboolbound(false);
    setclassresult([]);
    setfitems([]);
    setanim(false);
  };
  const [classresult,setclassresult] = useState([]);

  const GetDetectionResults = async () => {
    try {
      setboolbound(false);
      setresults([]);
      setclassresult([]);
    setfitems([]);
      const formData = new FormData();
      setanim(true);
      // Append the image data to FormData with key "image" and value "ourimage.jpg"
      formData.append('image', {
        uri: imageData,
        type: 'image/jpeg',
        name: 'ourimage.jpg',
      });

      const response = await fetch(HOST_URL+'/api/user/detect-my-food', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const responseData = await response.json();
      // console.log(responseData.data.results);
      if (responseData.data.results){
        const nextdata = await responseData.data.results ;
        setresults(responseData);
        nextOption(nextdata);////
        setboolbound(true);
      }
      else {
        showAlert();
      }


    } catch (err) {
      // console.log(err);
      setboolbound(false);
    
    }
    finally{
      setanim(false);
    }
  };
  const showAlert=()=>{
    Alert.alert(
      '',
      'No foods are detected in the Image',
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false }
    );
  }

  const drawBoundingBoxes=()=>(
    <View style={bstyles.container}>
    <RenderBoundingBoxes results={results} />
  </View>
  )

 const nextOption = async(results ) => {
  // console.log(results);
  // const result = results['data']['results'];
  const classNames = await Object.keys(results);
  // console.log(classNames);
  // Use functional update to avoid unnecessary re-renders
  setfitems(prevItems => [...prevItems, ...classNames]);
};

const showfAlert = (data) => {
  Alert.alert(
    '',
    'The Food Item is not Recommended to eat based on your health Condition',
    [
      {
        text: 'Continue at Risk',
        onPress: () => {
          setModalData([data]);
          openModal();
          setnames(data.name);
        },
      },
      {
        text: 'Avoid Food',
        style: 'cancel', // This will make the button appear in a different style (e.g., on the left)
        // onPress: () => {

        // },
      },
    ],
    { cancelable: true }
  );
};
  

  const getnutriinfo=async(foodn)=>{
    // console.log(foodid);
    // const foodid = foodn ;
    const token = await AsyncStorage.getItem('token');
    // console.log(foodn);

    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ foodname: foodn })
    };

    try {
      await fetch(
        HOST_URL+'/api/user/analyze-food', requestOptions)
        .then(response => {
          response.json()
            .then(data => {
              // console.log(data);
              if (data['data']['CALORIES(G)']) {
                if (data.alert === "no") {
                  showfAlert(data);
                }
                setclassresult(prevItems => [...prevItems,data])
                // setclassresult([...classresult,data])
                // console.log(data);
                
              }

            });
        })

    }
    catch (error) {
      // console.log(error);
    }
  }
  const sendAllDataToBackend = async (items) => {
    try {
      // console.log(items);
      
      const promises = await items.map(getnutriinfo);
      await Promise.all(promises);
      // console.log('All requests completed successfully.');

    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const [finresult,setfinresult] = useState([]);

  useEffect(()=>{
    setfinresult(classresult);
  },[classresult]);

  const displayCalorie=async()=>{
    // const foodid = myInput;
    // console.log(fitems);
    setclassresult([]);
    await sendAllDataToBackend(fitems);
    setclassresult(prevItems => [...prevItems,""])
    // console.log(classresult);

    openModal();      
    
    // fitems.forEach((item) => {
    //   // await getnutriinfo(item);
    // });
    // console.log(classresult);
    
  }
  const openModal = () => {
    // setModalData('Hello from Main Component!'); // Set the data you want to send
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.push('/Home');
  };
  const reloadnutri = ()=>{
    navigation.push('/Home');
  }

  const renderCancelPreviewButton = () => (
      <TouchableOpacity onPress={cancelPreview}
          style={{ width: '30%', height: '5%', position: 'absolute', bottom: 20 , left: 50, backgroundColor: 'white', alignSelf: 'center', backgroundColor: 'white',borderColor:'#294D61', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: '#294D61', fontWeight: '600', fontSize: 15 }}>Retake</Text>
        </TouchableOpacity>
  );

  const renderGetDetailsButton = () => (
    <TouchableOpacity onPress={GetDetectionResults}
        style={{ width: '30%', height: '5%', position: 'absolute', right: 40 ,bottom: 20 , alignSelf: 'center', backgroundColor: 'white',borderColor:'#294D61', borderRadius: 20, justifyContent: 'center', alignItems: 'center', disabled: anim }}
      >
        <Text style={{ color: '#294D61', fontWeight: '600', fontSize: 15 }}>Detect Food</Text>
      </TouchableOpacity>
);

const renderNextButton = () => (
  <TouchableOpacity onPress={displayCalorie}
      style={{ width: '30%', height: '5%', position: 'absolute', right: 40 ,bottom: 20 , alignSelf: 'center', backgroundColor: 'white',borderColor:'#294D61', borderRadius: 20, justifyContent: 'center', alignItems: 'center', disabled: anim }}
    >
      <Text style={{ color: '#294D61', fontWeight: '600', fontSize: 15 }}>Next</Text>
    </TouchableOpacity>
);

const animationLoader =()=>(
  <View style={pred_styles.container}>
  <Image
    source={require('./assets/pred-loading.gif')} // Replace 'your-gif-file.gif' with the actual file name
    style={pred_styles.gif}
    resizeMode="contain"
  />
</View>
)
  const renderVideoPlayer = () => (
    <Video
      source={{ uri: videoSource }}
      shouldPlay={true}
      style={styles.media}
    />
  );
  const renderVideoRecordIndicator = () => (
    <View style={styles.recordIndicatorContainer}>
      <View style={styles.recordDot} />
      <Text style={styles.recordTitle}>{"Recording..."}</Text>
    </View>
  );
  const renderCaptureControl = () => (
    <View style={styles.control}>
      <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
        <Text style={styles.text}>{"Flip"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onLongPress={recordVideo}
        onPressOut={stopVideoRecording}
        onPress={takePicture}
        style={styles.capture}
      />
    </View>
  );
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ModalComponent
          modalVisible={modalVisible}
          closeModal={closeModal}
          modalData={finresult}
          foodname={fitems}
          // reload={reloadnutri}
          status={true}
        /> 
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        flashMode={Camera.Constants.FlashMode.auto}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          // console.log("cammera error", error);
        }}
      />
      <View style={styles.container}>
        {anim && animationLoader()}
        {isVideoRecording && renderVideoRecordIndicator()}
        {videoSource && renderVideoPlayer()}
        {isPreview && renderCancelPreviewButton() }
        {isPreview && (!fitems.length > 0) && renderGetDetailsButton()}
        {isPreview && (fitems.length > 0) && renderNextButton()}
        {!videoSource && !isPreview && renderCaptureControl()}
        {boolbound && drawBoundingBoxes()}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    top: '10px',
    // bottom: '20px'
  },
  closeButton: {
    position: "absolute",
    // top: 35,
    // left: 15,
    bottom : 30 ,
    left: '50%',
    margin: 'auto' ,
    height: closeButtonSize,
    width: closeButtonSize,
    borderRadius: Math.floor(closeButtonSize / 2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4c5c4",
    opacity: 0.7,
    zIndex: 2,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: "68%",
    height: 1,
    backgroundColor: "black",
  },
  control: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  capture: {
    backgroundColor: "#f5f6f5",
    borderRadius: 5,
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
  },
  
});
const pred_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 400, // Adjust the width as needed
    height: 400, // Adjust the height as needed
  },
});
const bstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});