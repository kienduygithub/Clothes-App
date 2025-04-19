import { CommonColors } from "@/src/common/resource/colors";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Modal, StyleSheet, View } from "react-native";

type Props = {
    message?: string;
    textClose?: string;
    textConfirm?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    visible?: boolean;
    type?: "warning" | "warning-confirm"
}

const DialogNotification = ({
    message = '',
    textClose = 'Hủy',
    textConfirm = 'Đồng ý',
    onConfirm,
    onClose,
    visible = false,
    type = "warning-confirm"
}: Props) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <View style={{ paddingHorizontal: 16 }}>
                        <Text style={styles.message}>{message}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        {type === "warning-confirm" ? (
                            <>
                                <TouchableOpacity style={[styles.button]} onPress={onClose}>
                                    <Text style={styles.buttonText}>
                                        {textClose}
                                    </Text>
                                </TouchableOpacity>
                                <View style={styles.buttonDivider}></View>
                                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                                    <Text style={styles.buttonText}>{textConfirm}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={onConfirm}>
                                <Text style={styles.buttonText}>{textConfirm}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(65, 65, 65, 0.15)'
    },
    dialog: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: '80%',
        maxWidth: 400,
        paddingTop: 16,
        paddingBottom: 0,
    },
    message: {
        fontSize: 15,
        color: '#555', // Màu xám đậm cho nội dung
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ccc', // Viền trên nút giống iOS
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonDivider: {
        borderRightWidth: 0.5,
        borderRightColor: '#ccc', // Viền giữa hai nút
    },
    buttonText: {
        fontSize: 18,
        color: CommonColors.primary,
        fontWeight: '500',
    },
    confirmText: {
        fontWeight: '700', // Nút xác nhận đậm hơn
    },
});

export default DialogNotification;