import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabsPrincipal } from "./navigation/TabsPrincipal";
import { RootStackParamList } from "./types/navigation";
import { DetalleScreen } from "./screens/DetalleScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { ResultadosScreen } from "./screens/ResultadosScreen";
import { CreditosScreen } from "./screens/CreditosScreen";
import { ProgresoProvider } from "./data/progresoContext";

// Stack tipado: Stack.Screen solo acepta rutas declaradas en RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // La librería de gestos necesita este contenedor en la raíz para reconocer los gestos.
    <GestureHandlerRootView style={styles.raiz}>
      <SafeAreaProvider>
        <ProgresoProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: "#163a5f" },
                headerTintColor: "#4fd1c5",
                headerTitleStyle: { fontWeight: "bold" },
              }}
            >
              <Stack.Screen
                name="Principal"
                component={TabsPrincipal}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Detalle"
                component={DetalleScreen}
                options={{ title: "Ficha" }}
              />

              <Stack.Screen
                name="Quiz"
                component={QuizScreen}
                // El deslizar para volver del sistema choca con deslizar la tarjeta: se desactiva aquí.
                options={{ title: "Quiz", gestureEnabled: false }}
              />

              <Stack.Screen
                name="Resultados"
                component={ResultadosScreen}
                options={{ title: "Resultados" }}
              />

              <Stack.Screen
                name="Creditos"
                component={CreditosScreen}
                options={{ title: "Créditos", presentation: "modal" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </ProgresoProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
  },
});
