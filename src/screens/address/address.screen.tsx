import { Animated, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native"
import AddressStyle from "./address.style"
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import CustomBottomSheet from "@/src/components/custom-bottom-sheet/custom-bottom-sheet.component";
import AddressPicker from "./comp/address-selector.component";

type Props = {}

const addressData: any = [
    {
        id: '1',
        address: 'Dạ Hợp 12 Tằng, Phường Hữu Nghị, Thành Phố Hòa Bình, Hòa Bình',
        phone: '(+84) 839 822 333',
        isDefault: true,
    },
    {
        id: '2',
        address: 'Dạ Hợp 12 Tằng, Phường Hữu Nghị, Thành Phố Hòa Bình, Hòa Bình',
        phone: '(+84) 839 822 333',
        isDefault: false,
    },
];

type Location = {
    [province: string]: {
        [district: string]: string[];
    };
};


const levels = ['Tỉnh / Thành phố', 'Quận / Huyện', 'Phường / Xã'];

const AddressScreen = (props: Props) => {
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const openAddressBottomSheet = () => {
        setIsBottomSheetVisible(true);
    };
    const closeAddressBottomSheet = () => {
        setIsBottomSheetVisible(false);
    };
    const navigateToCreateAddress = () => {
        router.navigate("/(routes)/cru-address");
    }

    const renderAddressItem = ({ item }: { item: any }) => (
        <View style={styles.addressContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.phoneText}>Kiến duy | {item.phone}</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 14, color: CommonColors.primary }}>
                        Sửa
                    </Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.addressText}>{item.address}</Text>
            {item.isDefault && (
                <View
                    style={{
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: CommonColors.primary,
                        width: 70,
                        height: 26,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={styles.defaultLabel}>
                        Mặc định
                    </Text>
                </View>
            )}
        </View>
    );

    /** Breadcum */
    const [activeLevel, setActiveLevel] = useState(2);
    const animatedTop = useRef(new Animated.Value(2 * 60)).current;

    useEffect(() => {
        Animated.timing(animatedTop, {
            toValue: activeLevel * 60,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [activeLevel]);

    return (
        <View style={styles.container}>
            <Text style={{ paddingHorizontal: 20, paddingVertical: 10, fontSize: 16, fontWeight: '500' }}>
                Địa chỉ
            </Text>
            <FlatList
                data={addressData}
                renderItem={renderAddressItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => (
                    <TouchableOpacity style={styles.addButtonContainer} onPress={navigateToCreateAddress}>
                        <AntDesign name="pluscircleo" size={18} color={CommonColors.primary} />
                        <Text style={styles.addButtonText}>Thêm Địa Chỉ Mới</Text>
                    </TouchableOpacity>
                )}
            />
            <CustomBottomSheet
                isVisible={true}
                onClose={closeAddressBottomSheet}
            >
                <View style={styles.containerr}>
                    <View style={styles.column}>
                        {levels.map((item, index) => {
                            const isActive = index === activeLevel;
                            return (
                                <TouchableOpacity key={index} onPress={() => setActiveLevel(index)}>
                                    <View style={[styles.row, isActive && styles.activeRow]}>
                                        {/* Dot Column */}
                                        <View style={styles.dotColumn}>
                                            {/* Line between dots */}
                                            {index < levels.length - 1 && (
                                                <View style={styles.verticalLine} />
                                            )}

                                            {/* Dot */}
                                            <View
                                                style={[
                                                    styles.dot,
                                                    isActive && { backgroundColor: '#FF6600' },
                                                ]}
                                            />
                                        </View>

                                        {/* Text Column */}
                                        <View style={styles.textColumn}>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    isActive && { color: '#FF3B30', fontWeight: 'bold' },
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Animated Active Border */}
                        <Animated.View
                            style={[styles.activeBorder, { top: animatedTop }]}
                        />
                    </View>

                    {/* Reset link */}
                    <Text style={styles.reset}>Thiết lập lại</Text>
                </View>
            </CustomBottomSheet>
        </View>
    )
}

const styles = AddressStyle;

export default AddressScreen;