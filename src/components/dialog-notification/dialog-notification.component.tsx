import { CommonColors } from "@/src/common/resource/colors";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Modal, StyleSheet, View } from "react-native";

type Props = {
    title?: string;
    message?: string;
    textClose?: string;
    textConfirm?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    visible?: boolean;
}

const DialogNotification = ({
    title = '',
    message = '',
    textClose = 'Hủy',
    textConfirm = 'Đồng ý',
    onConfirm,
    onClose,
    visible = false,
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
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button]} onPress={onClose}>
                            <Text style={styles.buttonText}>
                                {textClose}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.buttonDivider}></View>
                        <TouchableOpacity style={styles.button} onPress={onConfirm}>
                            <Text style={styles.buttonText}>{textConfirm}</Text>
                        </TouchableOpacity>
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
    },
    dialog: {
        backgroundColor: 'rgba(65, 65, 65, 0.6)', // Màu nền xám nhạt giống iOS
        borderRadius: 12, // Bo góc mềm mại
        width: '80%', // Chiếm khoảng 80% chiều rộng màn hình
        maxWidth: 300, // Giới hạn chiều rộng tối đa
        paddingTop: 16,
        paddingBottom: 0,

    },
    title: {
        fontSize: 20,
        fontWeight: '600', // Font semi-bold giống iOS
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    message: {
        fontSize: 15,
        color: '#FFF', // Màu xám đậm cho nội dung
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5', // Viền trên nút giống iOS
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonDivider: {
        borderRightWidth: 0.2,
        borderRightColor: '#f5f5f5', // Viền giữa hai nút
    },
    buttonText: {
        fontSize: 18,
        color: '#007AFF', // Màu xanh chuẩn của nút iOS
        fontWeight: '500',
    },
    confirmText: {
        fontWeight: '700', // Nút xác nhận đậm hơn
    },
});

export default DialogNotification;