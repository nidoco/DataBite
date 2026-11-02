import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CatalogoScreen } from './screens/CatalogoScreen';
import { RootStackParamList } from './types/navigation';
import { DetalleScreen } from './screens/DetalleScreen';


// Stack tipado: Stack.Screen solo acepta rutas declaradas en RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#163a5f' },
            headerTintColor: '#4fd1c5',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          
          <Stack.Screen
            name="Catalogo"
            component={CatalogoScreen}
            options={{ title: 'DataBite' }}
          />

          <Stack.Screen
            name="Detalle"
            component={DetalleScreen}
            options={{ title: 'Ficha' }}
          />

        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
