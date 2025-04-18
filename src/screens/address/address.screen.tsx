import { FlatList, Text, TouchableOpacity, View } from "react-native"
import AddressStyle from "./address.style"
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useToast } from "@/src/customize/toast.context";
import { useCallback, useEffect, useState } from "react";
import { AddressModel } from "@/src/data/model/address.model";
import * as AddressManagement from "@/src/data/management/address.management";

type Props = {}

const AddressScreen = (props: Props) => {
    const { showToast } = useToast();
    const [addresses, setAddresses] = useState<AddressModel[]>([]);

    const fetchAddresses = async () => {
        try {
            const response = await AddressManagement.fetchAddressesByUser();
            setAddresses(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }

    const navigateToCreateAddress = () => {
        router.navigate("/(routes)/cru-address");
    }

    const renderAddressItem = ({ item }: { item: AddressModel }) => {
        const renderAddressDetails = () => {
            return `${item.address_detail}, ${item.ward?.name}, ${item.district?.name}, ${item.city?.name}`
        }

        return (
            <View style={styles.addressContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.phoneText}>Kiến duy | {item.phone}</Text>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 14, color: CommonColors.primary }}>
                            Sửa
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.addressText}>{renderAddressDetails()}</Text>
                {item.is_default && (
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
        )
    };

    useFocusEffect(
        useCallback(() => {
            fetchAddresses();
        }, [])
    )

    return (
        <View style={styles.container}>
            <Text style={{ paddingHorizontal: 20, paddingVertical: 10, fontSize: 16, fontWeight: '500' }}>
                Địa chỉ
            </Text>
            <FlatList
                data={addresses}
                renderItem={({ item }) => renderAddressItem({ item })}
                keyExtractor={(item) => `${item.id}`}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => (
                    <TouchableOpacity style={styles.addButtonContainer} onPress={navigateToCreateAddress}>
                        <AntDesign name="pluscircleo" size={18} color={CommonColors.primary} />
                        <Text style={styles.addButtonText}>Thêm Địa Chỉ Mới</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = AddressStyle;

export default AddressScreen;