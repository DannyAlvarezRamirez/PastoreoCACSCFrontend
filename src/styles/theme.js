import { StyleSheet } from 'react-native';

// Colors
export const colors = {
    main1: '#306840', // R: 48, G: 104, B: 64
    main2: '#58853c', // R: 88, G: 133, B: 60
    main3: '#a0c644', // R: 160, G: 198, B: 68
    main4: '#fecb05', // R: 254, G: 203, B: 5
    main5: '#bee3ee', // R: 190, G: 227, B: 238
    secondary1: '#95693f', // R: 149, G: 105, B: 63
    secondary2: '#e9741b', // R: 233, G: 116, B: 27
    secondary3: '#0052e2', // R: 0, G: 82, B: 226
    secondary4: '#e30613', // R: 227, G: 6, B: 19
};

// Typography
export const typography = StyleSheet.create({
    mainTitle: {
        fontFamily: 'Built Titling, Futura LtCn BT',
        fontSize: 24,
        fontWeight: 'bold',
    },
    secondaryTitle: {
        fontFamily: 'BEBAS NEUE, Arial',
        fontSize: 20,
        fontWeight: 'bold',
    },
    bodyText: {
        fontFamily: 'Arial',
        fontSize: 16,
    },
});

// Exporting common styles for easy reuse
export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.main1, // Default background color from the main palette
    },
    button: {
        backgroundColor: colors.main4,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Arial',
    },
});
