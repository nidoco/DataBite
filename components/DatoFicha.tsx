import { View, Text, StyleSheet } from 'react-native';

interface DatoFichaProps {
  etiqueta: string;
  valor: string;
}

export function DatoFicha({ etiqueta, valor }: DatoFichaProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 2,
  },
  etiqueta: {
    color: '#94a3b8',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  valor: {
    color: '#e2e8f0',
    fontSize: 17,
  },
});
