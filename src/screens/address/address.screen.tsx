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
            let response = await AddressManagement.fetchAddressesByUser();
            response = response.sort((a, b) => b.id - a.id);
            setAddresses(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }

    const navigateToCreateAddress = () => {
        router.navigate("/(routes)/cru-address");
    }

    const handleDeleteAddress = async (item: AddressModel, index: number) => {
        try {
            await AddressManagement.deleteAddressById(item.id);
            setAddresses(prev => {
                let updatedAddresses = [...prev];
                if (item.is_default) {
                    const remainingAddresses = updatedAddresses.filter((_, i) => i !== index);
                    if (remainingAddresses.length > 0) {
                        const latestAddress = remainingAddresses.reduce<AddressModel | undefined>(
                            (latest, addr) => {
                                return !latest || (addr.created_at && latest.created_at && new Date(addr.created_at) > new Date(latest.created_at)) ? addr : latest;
                            }, undefined
                        );

                        // Cập nhật is_default cho địa chỉ mới nhất
                        if (latestAddress) {
                            updatedAddresses = updatedAddresses.map(addr =>
                                addr.id === latestAddress.id ? { ...addr, is_default: true } as AddressModel : { ...addr, is_default: false } as AddressModel
                            );
                        }
                    }
                }
                updatedAddresses.splice(index, 1);

                return updatedAddresses;
            });

            showToast("Xóa địa chỉ thành công", "success");
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }


    const renderAddressItem = ({ item, index }: { item: AddressModel, index: number }) => {
        const renderAddressDetails = () => {
            return `${item.address_detail}, ${item.ward?.name}, ${item.district?.name}, ${item.city?.name}`
        }


        return (
            <View style={styles.addressContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.phoneText}>Kiến duy | {item.phone}</Text>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <TouchableOpacity>
                            <Text style={{ fontSize: 14, color: CommonColors.green }}>
                                Sửa
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ color: 'rgba(0, 0, 0, 0.5)' }}>|</Text>
                        <TouchableOpacity onPress={() => handleDeleteAddress(item, index)}>
                            <Text style={{ fontSize: 14, color: CommonColors.red }}>
                                Xóa
                            </Text>
                        </TouchableOpacity>
                    </View>
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
                renderItem={({ item, index }) => renderAddressItem({ item, index })}
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