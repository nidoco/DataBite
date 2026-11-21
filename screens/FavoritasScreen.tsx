import { FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SharkCard } from '../components/SharkCard';
import loadSharks from '../data/loadSharks';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList, TabsParamList } from '../types/navigation';
import { useProgreso } from '../data/progresoContext';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabsParamList, 'Favoritas'>,
    NativeStackScreenProps<RootStackParamList>
>;

export function FavoritasScreen({ navigation }: Props) {
    const { favoritas, desbloqueadas, cargando } = useProgreso();

    const sharks = loadSharks().filter(
        (shark) =>
            favoritas.includes(shark.id) &&
            (!shark.extinta || (!cargando && desbloqueadas.includes(shark.id)))
    );

    if (cargando) {
        return (
            <SafeAreaView style={styles.container} edges={['left', 'right']}>
                <Text style={styles.emptyText}>Cargando...</Text>
            </SafeAreaView>
        );
    }

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
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Todavía no tienes especies favoritas
                    </Text>
                }
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
});