import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native"
import AddressStyle from "./address.style"
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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

const locationData: Location = {
    'An Giang': {
        'Huyện An Phú': ['Xã Phú Hữu', 'Xã Phú Hội', 'Xã Quốc Thái'],
    },
};


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
    const [selectedProvince, setSelectedProvince] = useState<string | null>('An Giang');
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>('Huyện An Phú');
    const [selectedWard, setSelectedWard] = useState<string | null>(null);

    const reset = () => {
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
    };
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
                <ScrollView contentContainerStyle={styles.containerr}>
                    <View style={styles.headerr}>
                        <Text style={styles.headerText}>Khu vực được chọn</Text>
                        <TouchableOpacity onPress={reset}>
                            <Text style={styles.resetText}>Thiết lập lại</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Province */}
                    {selectedProvince && (
                        <View style={styles.step}>
                            <View style={styles.dot} />
                            <Text style={styles.stepText}>{selectedProvince}</Text>
                        </View>
                    )}

                    {/* District */}
                    {selectedDistrict && (
                        <View style={styles.step}>
                            <View style={styles.dot} />
                            <Text style={styles.stepText}>{selectedDistrict}</Text>
                        </View>
                    )}

                    {/* Ward */}
                    <TouchableOpacity style={styles.wardBox}>
                        <Ionicons name="radio-button-on" size={20} color="red" />
                        <Text style={styles.wardText}>
                            {selectedWard ? selectedWard : 'Chọn Phường/Xã'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </CustomBottomSheet>
        </View>
    )
}

const styles = AddressStyle;

export default AddressScreen;