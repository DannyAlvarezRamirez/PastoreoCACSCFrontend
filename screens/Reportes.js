import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { VictoryPie, VictoryBar, VictoryLine } from 'victory-native'; // Ensure proper import
import { Picker } from '@react-native-picker/picker';
import { Dialog, Portal, Provider } from 'react-native-paper'; // Add if missing
import DateTimePicker from '@react-native-community/datetimepicker'; // For date pickers
import request from '../objects/request'; // Ensure the request object is imported correctly

export default function Reportes() {
    const [selectedParameter, setSelectedParameter] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('');
    const [startDate, setStartDate] = useState(new Date()); // Add startDate
    const [endDate, setEndDate] = useState(new Date()); // Add endDate
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // Function to handle generating the report
    const handleGenerateReport = async () => {
        try {
            // Set up the API request to fetch report data
            request.setConfig({
                method: 'post',
                withCredentials: true,
                url: 'http://localhost:5075/api/Reporte/generate', // Replace with your API endpoint for generating reports
                data: {
                    registerType: selectedParameter, // The type of data being selected
                    reportType: selectedReportType,  // The type of report being generated
                    startDate, // Send startDate
                    endDate,   // Send endDate
                },
            });

            const response = await request.sendRequest();

            // Check if response data contains a valid report structure
            if (response.success && Array.isArray(response.data) && response.data.length > 0) {
                const reportContent = response.data[0]; // Since data is an array of arrays, check the first element

                // Ensure reportContent is not an empty array and contains valid objects
                if (Array.isArray(reportContent) && reportContent.length === 0) {
                    setDialogMessage('El reporte no contiene datos.');
                    setReportData(null); // No valid data
                } else {
                    setReportData(reportContent); // Set valid report data
                    setDialogMessage('Reporte generado exitosamente.');
                }
            } else {
                setDialogMessage('No se encontraron resultados o hubo un problema.');
            }
        } catch (error) {
            setDialogMessage('Ha ocurrido un problema. Inténtelo de nuevo más tarde.');
            console.error('Error:', error);
        }
        setIsDialogVisible(true); // Show dialog with the result
    };

    const handleExport = (format) => {
        // Simulate exporting report
        alert(`Exported report as ${format}`);
    };

    // Function to show the start date picker
    const handleShowStartDatePicker = () => {
        setShowStartDatePicker(true);
    };

    // Function to show the end date picker
    const handleShowEndDatePicker = () => {
        setShowEndDatePicker(true);
    };

    // Function to handle start date change
    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    // Function to handle end date change
    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };

    return (
        <Provider>
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
                        <Picker.Item label="Ganado" value="ganado" />
                        <Picker.Item label="Suministro" value="suministros" />
                        <Picker.Item label="Apartamentos" value="apartamentos" />
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
                        <Picker.Item label="Semanal" value="semanal" />
                        <Picker.Item label="Mensual" value="mensual" />
                        <Picker.Item label="Anual" value="anual" />
                    </Picker>

                    {/* Date Range Selection */}
                    <Text>Seleccionar Rango de Fechas</Text>

                    <TouchableOpacity onPress={handleShowStartDatePicker}>
                        <TextInput
                            style={styles.input}
                            placeholder="Fecha de Inicio"
                            value={startDate.toLocaleDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={handleStartDateChange}
                        />
                    )}

                    <TouchableOpacity onPress={handleShowEndDatePicker}>
                        <TextInput
                            style={styles.input}
                            placeholder="Fecha de Fin"
                            value={endDate.toLocaleDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={handleEndDateChange}
                        />
                    )}

                    {/* Generate Report Button */}
                    <Button title="Generar Reporte" onPress={handleGenerateReport} />

                    {/* Display Report */}
                    {reportData && (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Visualización del Reporte</Text>
                            {selectedReportType === 'semanal' && (
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

                {/* Dialog to display messages */}
                <Portal>
                    <Dialog
                        visible={isDialogVisible}
                        onDismiss={() => setIsDialogVisible(false)}
                    >
                        <Dialog.Title>Información</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button title="OK" onPress={() => setIsDialogVisible(false)} />{/* Close dialog */}
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </Provider>
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
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
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
