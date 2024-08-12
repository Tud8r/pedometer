import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';

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

  return (
    <View style={styles.container}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
      <Text>Current step count: {currentStepCount}</Text>
      <View>
        <CircularProgress
          value={currentStepCount}
          maxValue={100}
          radius={120}
          textColor={'#351F17'}
          activeStrokeColor={'#351F17'}
          inActiveStrokeColor={'#BCCCBF'}
          progressValueColor={'#351F17'}
          inActiveStrokeOpacity={0.5}
          inActiveStrokeWidth={40}
          activeStrokeWidth={40}
          strokeLinecap = {'butt'}
          
          
          dashedStrokeConfig={{
            count: 10,
            width: 80,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
