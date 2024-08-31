import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { VictoryPie, VictoryBar, VictoryLine } from 'victory-native';
import { Picker } from '@react-native-picker/picker';

export default function Reportes() {
  const [selectedParameter, setSelectedParameter] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('');
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = () => {
    // Simulate generating report data
    const dummyData = [
      { x: "January", y: 35 },
      { x: "February", y: 40 },
      { x: "March", y: 25 },
      { x: "April", y: 50 },
    ];
    setReportData(dummyData);
  };

  const handleExport = (format) => {
    // Simulate exporting report
    alert(`Exported report as ${format}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Generar Reportes</Text>

        {/* Data Selection */}
        <Text>Seleccionar Parámetro</Text>
        <Picker
          selectedValue={selectedParameter}
          onValueChange={(value) => setSelectedParameter(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un Parámetro" value="" />
          <Picker.Item label="Peso de Ganado" value="pesoGanado" />
          <Picker.Item label="Consumo de Agua" value="consumoAgua" />
          <Picker.Item label="Consumo de Energía" value="consumoEnergia" />
          {/* Add more parameters as needed */}
        </Picker>

        {/* Report Type Selection */}
        <Text>Tipo de Reporte</Text>
        <Picker
          selectedValue={selectedReportType}
          onValueChange={(value) => setSelectedReportType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione el Tipo de Reporte" value="" />
          <Picker.Item label="Diario" value="diario" />
          <Picker.Item label="Mensual" value="mensual" />
          <Picker.Item label="Anual" value="anual" />
        </Picker>

        {/* Time Frame Selection */}
        <Text>Seleccionar Periodo</Text>
        <Picker
          selectedValue={selectedTimeFrame}
          onValueChange={(value) => setSelectedTimeFrame(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un Periodo" value="" />
          <Picker.Item label="Última Semana" value="ultimaSemana" />
          <Picker.Item label="Último Mes" value="ultimoMes" />
          <Picker.Item label="Último Año" value="ultimoAno" />
        </Picker>

        {/* Generate Report Button */}
        <Button title="Generar Reporte" onPress={handleGenerateReport} />

        {/* Display Report */}
        {reportData && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Visualización del Reporte</Text>
            {selectedReportType === 'diario' && (
              <VictoryBar data={reportData} />
            )}
            {selectedReportType === 'mensual' && (
              <VictoryLine data={reportData} />
            )}
            {selectedReportType === 'anual' && (
              <VictoryPie data={reportData} />
            )}
          </View>
        )}

        {/* Export Buttons */}
        <View style={styles.exportButtons}>
          <Button title="Exportar PDF" onPress={() => handleExport('PDF')} />
          <Button title="Exportar Excel" onPress={() => handleExport('Excel')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
