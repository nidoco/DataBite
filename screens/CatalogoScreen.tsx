import { FlatList, Text, StyleSheet, View } from 'react-native';
import { SharkCard } from '../components/SharkCard';
import loadSharks from '../data/loadSharks';

export function CatalogoScreen() {
    const sharks = loadSharks();

    return (
        <View style={styles.container}>
            <FlatList
                data={sharks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <SharkCard shark={item} />}
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
