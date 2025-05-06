import { StyleSheet, Platform } from 'react-native';

const ProductListStyle = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
        borderBottomWidth: 2,
        borderBottomColor: '#33adff',
    },
    titleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    titleBtn: {
        fontSize: 15,
        fontWeight: '500',
        color: '#33adff',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    itemsWrapper: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        marginBottom: 50,
    },
    productWrapper: {
        width: '50%',
        paddingLeft: 5,
    },
});

export default ProductListStyle;