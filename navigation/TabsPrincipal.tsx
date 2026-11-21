import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CatalogoScreen } from '../screens/CatalogoScreen';
import { FavoritasScreen } from '../screens/FavoritasScreen';
import { TabsParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabsParamList>();

// Pestañas principales de la app: Catálogo y Favoritas.
export function TabsPrincipal() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#163a5f' },
        headerTintColor: '#4fd1c5',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#163a5f' },
        tabBarActiveTintColor: '#4fd1c5',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tab.Screen
        name="Catalogo"
        component={CatalogoScreen}
        options={{ title: 'DataBite', tabBarLabel: 'Catálogo' }}
      />
      <Tab.Screen
        name="Favoritas"
        component={FavoritasScreen}
        options={{ title: 'Favoritas' }}
      />
    </Tab.Navigator>
  );
}
