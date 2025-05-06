import { StyleSheet, Platform } from 'react-native';

const RegisterShopStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    headerWrapper: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#33adff',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    stepIndicator: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    card: {
        marginHorizontal: 16,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    section: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: '#374151',
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 8,
        overflow: 'hidden',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1f2937',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    icon: {
        padding: 10,
    },
    error: {
        fontSize: 12,
        color: '#ef4444',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#33adff',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    avatarText: {
        color: '#a1a1aa',
        fontSize: 10,
        marginTop: 4,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'Roboto-Medium',
    },
    backgroundContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    background: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#33adff',
    },
    backgroundPlaceholder: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    submitButton: {
        marginTop: 16,
        borderRadius: 5,
        backgroundColor: '#33adff',
        overflow: 'hidden',
        paddingVertical: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
    },
    backButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#33adff',
    },
    backButtonText: {
        color: '#33adff',
    },

    btnBackMe: {
        position: 'absolute',
        top: '65%',
        left: 0,
    },
    btnBackMeText: {
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'Roboto-Bold',
        color: '#33adff',
        fontWeight: '600'
    }
});

export default RegisterShopStyle;