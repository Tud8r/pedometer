import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  useFonts,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from "@expo-google-fonts/fredoka";

const background = require('./assets/background.jpeg');;

export default function App() {

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);


  // Function to simulate step count increment
  const simulateSteps = () => {
    const intervalId = setInterval(() => {
      //setCurrentStepCount(prevStepCount => prevStepCount + 1);
    }, 10);

    return intervalId;

  };

  const subscribe = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Watch for step count changes
        const subscription = Pedometer.watchStepCount(result => {
          console.log('Current step count:', result.steps); // Debugging output

          setCurrentStepCount(result.steps);
        });

        return subscription;
      } else {
        console.warn('Pedometer is not available on this device.');
      }
    } catch (error) {
      console.error("Error with pedometer:", error);
      setIsPedometerAvailable('not available');
    }
    console.log('Is pedometer available:', isPedometerAvailable);


  };

  useEffect(() => {
    // Start the step simulation
    const intervalId = simulateSteps();

    // Set up pedometer subscription
    const subscription = subscribe();

    return () => {
      // Clean up pedometer subscription

      // Clear interval when component unmounts
      clearInterval(intervalId);
    };

  }, []);
  let [fontsLoaded] = useFonts({
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <ImageBackground source={background} resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>


      <View style={styles.container}>
      <TouchableOpacity
            style={{
              position: 'absolute', 
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              alignSelf: 'flex-start',
              justifyContent: 'center',
              top:25,
              left:10,
              width: 45,
              height: 45,
              backgroundColor: '#4A5B6D',
              borderRadius: 50,
            }}
          >
            <Ionicons name="menu-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        <View style={styles.UpperContainer}>
          
          
          <Text style={{ color: '#FFFFFF', fontFamily: 'Fredoka_600SemiBold', fontSize: 30 }}>Health Tracker</Text>
          <Text></Text>
          <Text></Text>

          <Text style={{ color: '#FFFFFF', fontFamily: 'Fredoka_600SemiBold', fontSize: 20 }}>Great job! You've walked {currentStepCount}</Text>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Fredoka_600SemiBold', fontSize: 20 }}>steps today!</Text>
        </View>
        <View style={styles.Progress}>
          <CircularProgress

            value={currentStepCount}
            maxValue={100}
            radius={150}
            title='steps'
            titleStyle={{ color: '#FFFFFF', fontFamily: 'Fredoka_600SemiBold', fontSize: 30 , bottom:20}}
            titleColor={'#FFFFFF'}
            textColor={'#FFFFFF'}
            activeStrokeColor={'#5C8646'}
            inActiveStrokeColor={'#BCCCBF'}
            progressValueColor={'#FFFFFF'}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={40}
            activeStrokeWidth={40}
            strokeLinecap={'butt'}


            dashedStrokeConfig={{
              count: 10,
              width: 100,
            }}
          />
        </View>
        <View style={styles.BottomContainer}>

          <Text style={{ color: '#FFFFFF', fontFamily: 'Fredoka_600SemiBold', fontSize: 20, textAlign: 'center', }}>Every step counts towards a healthier you and a greener planet. You've earned  ?? eco-point!</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  UpperContainer: {
    flex: 2,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },
  BottomContainer: {
    flex: 2,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'flex-start',

  },
  Progress: {
    flex: 5,
    justifyContent: 'center',
  }

});
