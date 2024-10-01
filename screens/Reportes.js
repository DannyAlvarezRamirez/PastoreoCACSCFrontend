import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Dialog, Portal, Provider } from 'react-native-paper'; // Add if missing
import DateTimePicker from '@react-native-community/datetimepicker'; // For date pickers
import request from '../objects/request'; // Ensure the request object is imported correctly

// Conditionally import the charting library based on the platform
const { VictoryPie, VictoryBar, VictoryLine } = Platform.OS === 'web' ? require('victory') : require('victory-native');

import * as XLSX from 'xlsx';  // Import xlsx for Excel file creation
import { saveAs } from 'file-saver';  // For saving files in Web
import jsPDF from 'jspdf';  // For generating PDFs on web

// Conditionally import only for mobile platforms
let RNFS;
let Share;
let PdfLib;
let HtmlToPdf;
if (Platform.OS !== 'web') {
    RNFS = require('react-native-fs');
    Share = require('react-native-share');
    PdfLib = require('react-native-pdf-lib'); // For generating PDFs on Android/iOS
    HtmlToPdf = require('react-native-html-to-pdf'); // Alternative for creating PDFs from HTML
}

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

    // Helper function to format dates to 'YYYY-MM-DD'
    const formatDateForInput = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().substring(0, 10);
        }
        return ''; // Return an empty string if the date is invalid
    };

    const transformDataForVictory = (apiData, registerType) => {
        //if (apiData && apiData.length > 0 && apiData[0].length > 0) {
        //    return apiData[0].map((item, index) => ({
        //        x: `Ganado ${item.ganadoId}`, // Or use any other field for the x-axis label
        //        y: item.peso,                 // For example, we use 'peso' (weight) for the y-axis
        //    }));
        //}
        //return [];
        if (apiData && apiData.length > 0 && apiData[0].length > 0) {
            // Transform data based on the registerType
            if (registerType === 'ganado') {
                return apiData[0].map((item, index) => ({
                    x: `Ganado ${item.ganadoId}`, // Use the ganadoId as the x-axis label
                    y: item.peso,                 // Use 'peso' (weight) for the y-axis value
                }));
            } else if (registerType === 'suministros') {
                return apiData[0].map((item, index) => ({
                    x: `Suministro ${item.suministroId}`, // Use suministroId as the x-axis label
                    y: item.cantidad,                    // Use 'cantidad' for the y-axis value
                }));
            } else if (registerType === 'apartamentos') {
                return apiData[0].map((item, index) => ({
                    x: `Apartamento ${item.apartamentoId}`,  // Use apartamentoId as the x-axis label
                    y: item.tamanoArea || 0,                // Use 'tamanoArea' (size) for the y-axis, default to 0 if null 
                }));
            }
        }
        return [];  // Return an empty array if no data is found
    };

    // Function to export data to Excel
    const handleExportToExcel = () => {
        // Create a new Excel workbook
        const wb = XLSX.utils.book_new();

        // Convert reportData to a worksheet (if reportData is an array of objects)
        const ws = XLSX.utils.json_to_sheet(reportData);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Report');

        const fileName = `Report_${Date.now()}.xlsx`;

        if (Platform.OS === 'web') {
            // For Web
            const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            saveAs(blob, fileName);
            setDialogMessage('The report has been exported as ' + fileName);
        } else {
            // For Android/iOS
            const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
            const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

            RNFS.writeFile(filePath, wbout, 'base64')
                .then(() => {
                    // Share the file after it is written
                    Share.open({
                        url: `file://${filePath}`,
                        title: 'Export Report',
                        message: 'Here is your report',
                    })
                        .then(() => {
                            setDialogMessage('The report has been exported as ' + fileName);
                        })
                        .catch((err) => {
                            setDialogMessage('Sharing Error:', err);
                            console.error('Sharing Error:', err);
                        });
                })
                .catch((err) => {
                    setDialogMessage('File Write Error: ', err);
                    console.error('File Write Error:', err);
                });
        }
    };

    // Function to export data to PDF
    const handleExportToPdf = async () => {
        const fileName = `Report_${Date.now()}.pdf`;

        if (Platform.OS === 'web') {
            // Web: Generate PDF using jsPDF
            const doc = new jsPDF();
            doc.text('Report Data', 10, 10);
            reportData.forEach((item, index) => {
                doc.text(`${item.x}: ${item.y}`, 10, 20 + index * 10); // Add report data to PDF
            });
            doc.save(fileName);
            setDialogMessage('The report has been exported as ' + fileName);
        }
        else {
            // Android/iOS: Generate PDF using react-native-pdf-lib or react-native-html-to-pdf
            try {
                const htmlContent = `
          <h1>Report Data</h1>
          <ul>
            ${reportData.map(item => `<li>${item.x}: ${item.y}</li>`).join('')}
          </ul>
        `;

                const pdfFile = await HtmlToPdf.convert({
                    html: htmlContent,
                    fileName: fileName.replace('.pdf', ''),
                    directory: 'Documents',
                });

                Share.open({
                    url: `file://${pdfFile.filePath}`,
                    title: 'Export Report',
                    message: 'This is your report',
                });
                setDialogMessage('The report has been exported as ' + fileName);
            }
            catch (error) {
                console.error('Error exporting PDF:', error);
                setDialogMessage('Failed to export report to PDF.');
            }
        }
    };
    
    // Function to handle generating the report
    const handleGenerateReport = async () => {
        // Validate the required filters
        if (!selectedParameter) {
            setDialogMessage('Debe seleccionar un parámetro.');
            return;
        }

        if (!selectedReportType) {
            setDialogMessage('Debe seleccionar un tipo de reporte.');
            return;
        }

        if (!startDate || !endDate) {
            setDialogMessage('Debe seleccionar una fecha de inicio y una fecha de fin.');
            return;
        }

        // Check if the start date is before the end date
        if (new Date(startDate) > new Date(endDate)) {
            setDialogMessage('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        try {
            // Set up the API request to fetch report data
            request.setConfig({
                method: 'post',
                withCredentials: true,
                url: 'http://localhost:5075/api/Reporte/generate', // Replace with your API endpoint for generating reports 
                data: {
                    registerType: selectedParameter, // The type of data being selected
                    reportType: selectedReportType,  // The type of report being generated
                    startDate: startDate.toISOString(), // Send startDate
                    endDate: endDate.toISOString(),   // Send endDate
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
                }
                else {
                    // After getting the response
                    const transformedData = transformDataForVictory(response.data, selectedParameter);

                    if (transformedData.length > 0) {
                        // Set valid report data
                        setReportData(transformedData); // Use this data for the charts
                        setDialogMessage('Reporte generado exitosamente.');
                    }
                    else {
                        setDialogMessage("No data available for the selected report.");
                        setIsDialogVisible(true);
                    }
                }
            }
            else {
                setDialogMessage('No se encontraron resultados o hubo un problema.');
            }
        }
        catch (error) {
            setDialogMessage('Ha ocurrido un problema. Inténtelo de nuevo más tarde.');
            console.error('Error:', error);
        }
        setIsDialogVisible(true); // Show dialog with the result
    };

    // Function to show the start date picker
    const handleShowStartDatePicker = () => {
        if (Platform.OS === 'web') {
            // Web platform, no need to show picker as it's handled in input directly
            return;
        }
        setShowStartDatePicker(true);
    };

    // Function to show the end date picker
    const handleShowEndDatePicker = () => {
        if (Platform.OS === 'web') {
            // Web platform, no need to show picker as it's handled in input directly
            return;
        }
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

                    {Platform.OS === 'web' ? (
                        <>
                            <label htmlFor="start">Fecha de Inicio</label>
                            <input
                                type="date"
                                id="start"
                                name="trip-start"
                                value={formatDateForInput(startDate)}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                style={{ width: '100%', height: '40px', borderColor: '#ccc', borderWidth: '1px', marginBottom: '10px', padding: '0.4rem' }}
                            />
                            <label htmlFor="end">Fecha de Fin</label>
                            <input
                                type="date"
                                id="end"
                                name="trip-end"
                                value={formatDateForInput(endDate)}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                style={{ width: '100%', height: '40px', borderColor: '#ccc', borderWidth: '1px', marginBottom: '10px', padding: '0.4rem' }}
                            />
                        </>
                    ) : (
                        <>
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
                        </>
                    )}

                    {/* Generate Report Button */}
                    <Button title="Generar Reporte" onPress={handleGenerateReport} />

                    {/* Display Report */}
                    {reportData && reportData.length > 0 && (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Visualización del Reporte</Text>
                            {selectedReportType === 'semanal' && (
                                <VictoryBar data={reportData}
                                    width={350}         // Adjust the width
                                    height={250}        // Adjust the height
                                    padding={{ top: 20, bottom: 60, left: 60, right: 20 }}  // Add some padding for labels
                                />
                            )}
                            {selectedReportType === 'mensual' && (
                                <VictoryLine data={reportData}
                                    data={reportData}
                                    width={350}         // Adjust the width
                                    height={250}        // Adjust the height
                                    padding={{ top: 20, bottom: 60, left: 60, right: 20 }}  // Add some padding for labels
                                />
                            )}
                            {selectedReportType === 'anual' && (
                                <VictoryPie data={reportData}
                                    width={300}         // Adjust the width for pie chart
                                    height={300}        // Adjust the height
                                    innerRadius={50}    // Optionally add inner radius for donut chart effect
                                    padding={{ top: 20, bottom: 60, left: 60, right: 20 }}  // Add some padding for labels/>
                                />
                            )}
                        </View>
                    )}

                    {/* Export Buttons */}
                    <View style={styles.exportButtons}>
                        <Button title="Exportar PDF" onPress={handleExportToPdf} />
                        <Button title="Exportar Excel" onPress={handleExportToExcel} />
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
