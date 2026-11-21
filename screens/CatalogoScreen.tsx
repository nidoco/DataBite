import { FlatList, Text, StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharkCard } from '../components/SharkCard';
import loadSharks from '../data/loadSharks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList, TabsParamList } from '../types/navigation';
import { useLayoutEffect } from 'react';
import { useProgreso } from '../data/progresoContext';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabsParamList, 'Catalogo'>,
    NativeStackScreenProps<RootStackParamList>
>;

export function CatalogoScreen({ navigation }: Props) {
    const { desbloqueadas, cargando } = useProgreso();

    // Las extintas solo aparecen cuando ya se desbloquearon. Mientras carga el progreso, se ocultan.
    const sharks = loadSharks().filter(
        (shark) => !shark.extinta || (!cargando && desbloqueadas.includes(shark.id))
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.encabezadoDerecha}>
                    <Pressable onPress={() => navigation.navigate('Creditos')}>
                        <Text style={styles.botonQuiz}>Créditos</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Quiz')}>
                        <Text style={styles.botonQuiz}>Quiz</Text>
                    </Pressable>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <FlatList
                data={sharks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SharkCard
                        shark={item}
                        onPress={() => navigation.navigate('Detalle', { id: item.id })}

                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Sin especies</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a2540',
    },
    emptyText: {
        textAlign: 'center',
        padding: 16,
        marginTop: 20,
        fontSize: 16,
        color: '#cbd5e0',
    },
    encabezadoDerecha: {
        flexDirection: 'row',
        gap: 16,
        marginRight: 8,
    },
    botonQuiz: {
        color: '#4fd1c5',
        fontSize: 16,
        fontWeight: 'bold',
    },

});