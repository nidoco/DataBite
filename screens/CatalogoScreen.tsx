import { View, FlatList, Text, StyleSheet } from 'react-native';
import { SharkCard } from '../components/SharkCard';
import loadSharks from '../data/loadSharks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Catalogo'>;

export function CatalogoScreen({ navigation }: Props) {

    const sharks = loadSharks();

    return (
        <View style={styles.container}>
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
        </View>
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