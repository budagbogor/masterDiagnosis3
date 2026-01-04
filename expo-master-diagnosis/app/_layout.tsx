import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Master Diagnosis BOA',
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="diagnosis" 
          options={{ 
            title: 'Diagnosis Kendaraan',
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="dtc-library" 
          options={{ 
            title: 'Database DTC',
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="history" 
          options={{ 
            title: 'Riwayat Diagnosis',
            headerStyle: {
              backgroundColor: '#1e293b',
            },
            headerTintColor: '#fff',
          }} 
        />
      </Stack>
    </>
  );
}