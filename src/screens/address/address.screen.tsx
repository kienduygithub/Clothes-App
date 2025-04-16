import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native"
import AddressStyle from "./address.style"
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import CustomBottomSheet from "@/src/components/custom-bottom-sheet/custom-bottom-sheet.component";
import { useToast } from "@/src/customize/toast.context";
import AddressSelector from "./comp/address-selector.component";

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

const AddressScreen = (props: Props) => {
    const { showToast } = useToast();
    const { height: HEIGHT_SCREEN } = Dimensions.get('window');
    const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(true);

    const closeBottomSheet = () => {
        setIsOpenBottomSheet(false);
    }

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
                onClose={closeBottomSheet}
                height={HEIGHT_SCREEN - 80}
            >
                <AddressSelector />
            </CustomBottomSheet>
        </View>
    )
}

const styles = AddressStyle;

export default AddressScreen;