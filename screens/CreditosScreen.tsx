import { FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import creditos from '../data/creditos.json';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Creditos'>;

const fuentesDeDatos = [
  {
    nombre: 'Wikidata',
    uso: 'Lista de especies y datos básicos',
    licencia: 'CC0',
    url: 'https://www.wikidata.org',
  },
  {
    nombre: 'FishBase',
    uso: 'Medidas, nombres en español y alimentación',
    licencia: 'CC BY-NC',
    url: 'https://www.fishbase.se',
  },
  {
    nombre: 'Lista Roja de la UICN',
    uso: 'Estado de conservación de cada especie',
    licencia: 'Uso autorizado con token, sin fines comerciales',
    url: 'https://www.iucnredlist.org',
  },
];

// Modal con el autor, la licencia y la fuente de cada foto de la app.
export function CreditosScreen({ navigation }: Props) {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.lista}
      data={creditos}
      keyExtractor={(item) => item.identificador}
      renderItem={({ item }) => (
        <View style={styles.tarjeta}>
          <Text style={styles.autor}>{item.autor}</Text>
          <Text style={styles.licencia}>Licencia: {item.licencia}</Text>
          <Pressable onPress={() => Linking.openURL(item.fuente)}>
            <Text style={styles.enlace}>Ver la foto en Wikimedia Commons</Text>
          </Pressable>
        </View>
      )}
      ListHeaderComponent={
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Fuentes de datos</Text>
          {fuentesDeDatos.map((fuente) => (
            <View key={fuente.nombre} style={styles.fuente}>
              <Text style={styles.autor}>{fuente.nombre}</Text>
              <Text style={styles.licencia}>{fuente.uso}</Text>
              <Text style={styles.licencia}>Licencia: {fuente.licencia}</Text>
              <Pressable onPress={() => Linking.openURL(fuente.url)}>
                <Text style={styles.enlace}>Visitar el sitio</Text>
              </Pressable>
            </View>
          ))}
          <Text style={styles.titulo}>Fotos</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.texto}>No hay créditos disponibles</Text>}
      ListFooterComponent={
        <Pressable style={styles.boton} onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Cerrar</Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },
  lista: {
    padding: 16,
    gap: 12,
  },
  tarjeta: {
    backgroundColor: '#163a5f',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  autor: {
    color: '#cbd5e0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  licencia: {
    color: '#94a3b8',
    fontSize: 14,
  },
  enlace: {
    color: '#4fd1c5',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  titulo: {
    color: '#4fd1c5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fuente: {
    gap: 4,
    paddingVertical: 6,
  },
  texto: {
    color: '#cbd5e0',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  boton: {
    backgroundColor: '#4fd1c5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: {
    color: '#0a2540',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
