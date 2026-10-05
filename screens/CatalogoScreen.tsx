import { FlatList, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SharkCard } from '../components/SharkCard';
import loadSharks from '../data/loadSharks';

export function CatalogoScreen() {
    const sharks = loadSharks();

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={sharks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SharkCard shark={item} />}
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
});