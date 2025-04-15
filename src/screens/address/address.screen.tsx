import { Animated, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native"
import AddressStyle from "./address.style"
import { CommonColors } from "@/src/common/resource/colors";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import CustomBottomSheet from "@/src/components/custom-bottom-sheet/custom-bottom-sheet.component";
import { CityModel, DistrictModel, WardModel } from "@/src/data/model/address.model";
import * as AddressManagement from '@/src/data/management/address.management';
import { useToast } from "@/src/customize/toast.context";

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
    const [cities, setCities] = useState<CityModel[]>([]);
    const [districts, setDistricts] = useState<DistrictModel[]>([]);
    const [wards, setWards] = useState<WardModel[]>([]);
    const [selectedCity, setSelectedCity] = useState<CityModel | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictModel | null>(null);
    const [selectedWard, setSelectedWard] = useState<WardModel | null>(null);
    const [step, setStep] = useState<number>(0);
    const animatedTop = useRef(new Animated.Value(2 * 50)).current;

    useEffect(() => {
        fetchCities();
    }, [])

    const fetchCities = async () => {
        try {
            const response = await AddressManagement.fetchCities();
            setCities(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const fetchDistrictsByCityId = async (cityId: number) => {
        try {
            const response = await AddressManagement.fetchDistrictsByCityId(cityId);
            setDistricts(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const fetchWardsByDistrictId = async (districtId: number) => {
        try {
            const response = await AddressManagement.fetchWardsByDistrictId(districtId);
            setWards(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleProvinceSelect = async (city: CityModel) => {
        try {
            setSelectedCity(city);
            setSelectedDistrict(null);
            setSelectedWard(null);
            await fetchDistrictsByCityId(city.id);
            setStep(1);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleDistrictSelect = async (dist: DistrictModel) => {
        try {
            setSelectedDistrict(dist);
            if (!selectedWard) {
                setSelectedWard(null);
            }
            await fetchWardsByDistrictId(dist.id);
            setStep(2);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleWardSelect = (ward: WardModel) => {
        setSelectedWard(ward);
    };

    const renderStep = (currentStep: number) => {
        if (currentStep === 0) {
            return (
                <FlatList
                    data={cities}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={[styles.section, { borderRadius: 0, paddingHorizontal: 0 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.listItem, { paddingHorizontal: 22 }]}
                            onPress={() => handleProvinceSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {selectedCity?.id === item.id && (
                                <Feather name="check" size={24} color={CommonColors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: 42,       // chiều cao mỗi item (có thể đo cụ thể nếu custom)
                        offset: 42 * index,
                        index,
                    })}
                    initialScrollIndex={!selectedCity ? 0 : cities.findIndex(i => i.id === selectedCity.id)}
                />
            );
        } else if (currentStep === 1) {
            return (
                <FlatList
                    data={districts}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={[styles.section, { borderRadius: 0, paddingHorizontal: 0 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.listItem, { paddingHorizontal: 22 }]}
                            onPress={() => handleDistrictSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {selectedDistrict?.id === item.id && (
                                <Feather name="check" size={24} color={CommonColors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: 42,       // chiều cao mỗi item (có thể đo cụ thể nếu custom)
                        offset: 42 * index,
                        index,
                    })}
                    initialScrollIndex={!selectedDistrict ? 0 : districts.findIndex(i => i.id === selectedDistrict.id)}
                />
            );
        } else if (currentStep === 2) {
            return (
                <FlatList
                    data={wards}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={[styles.section, { borderRadius: 0, paddingHorizontal: 0 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={[styles.listItem, { paddingHorizontal: 22 }]}
                            onPress={() => handleWardSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {selectedWard?.id === item.id && (
                                <Feather name="check" size={24} color={CommonColors.primary} />
                            )}
                        </TouchableOpacity>
                    )}
                    getItemLayout={(_, index) => ({
                        length: 42,       // chiều cao mỗi item (có thể đo cụ thể nếu custom)
                        offset: 42 * index,
                        index,
                    })}
                    initialScrollIndex={!selectedWard ? 0 : wards.findIndex(i => i.id === selectedWard.id)}
                />
            );
        }
        return null;
    };

    const renderNameStep = (currentStep: number) => {
        if (currentStep === 0) {
            return (
                <Text style={{ fontSize: 14, fontWeight: '500' }}>Tỉnh/Thành phố</Text>
            );
        } else if (currentStep === 1) {
            return (
                <Text style={{ fontSize: 14, fontWeight: '500' }}>Quận/Huyện</Text>
            );
        } else if (currentStep === 2) {
            return (
                <Text style={{ fontSize: 14, fontWeight: '500' }}>Phường/Xã</Text>
            );
        }
        return null;
    }

    useEffect(() => {
        Animated.timing(animatedTop, {
            toValue: step * 50,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [step]);

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
                    <View style={styles.section}>
                        <View style={styles.column}>
                            {/* Province */}
                            <TouchableOpacity onPress={() => setStep(0)}>
                                <View style={[styles.row, step === 0 && styles.activeRow]}>
                                    {/* Dot Column */}
                                    <View style={[styles.dotColumn, step === 0 && styles.dotColumnActive]}>
                                        {/* Dot */}
                                        <View
                                            style={[
                                                styles.dot,
                                                step === 0 && { backgroundColor: CommonColors.primary },
                                            ]}
                                        ></View>
                                    </View>

                                    {/* Text Column */}
                                    <View style={[styles.textColumn, { marginLeft: 10 }]}>
                                        <Text
                                            style={[
                                                styles.text,
                                                step === 0 && { color: CommonColors.primary, fontWeight: '500' },
                                            ]}
                                        >
                                            {selectedCity ? selectedCity.name : 'Chọn Tỉnh/Thành phố'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {selectedCity && (
                                <TouchableOpacity onPress={() => setStep(1)}>
                                    <View style={[styles.row, step === 1 && styles.activeRow]}>
                                        {/* Dot Column */}
                                        <View style={[styles.dotColumn, step === 1 && styles.dotColumnActive]}>
                                            {/* Dot */}
                                            <View
                                                style={[
                                                    styles.dot,
                                                    step === 1 && { backgroundColor: CommonColors.primary },
                                                ]}
                                            ></View>
                                        </View>

                                        {/* Text Column */}
                                        <View style={[styles.textColumn, { marginLeft: 10 }]}>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    step === 1 && { color: CommonColors.primary, fontWeight: '500' },
                                                ]}
                                            >
                                                {selectedDistrict ? selectedDistrict.name : 'Chọn Quận/Huyện'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {selectedDistrict && (
                                <TouchableOpacity onPress={() => setStep(2)}>
                                    <View style={[styles.row, step === 2 && styles.activeRow]}>
                                        {/* Dot Column */}
                                        <View style={[styles.dotColumn, step === 2 && styles.dotColumnActive]}>
                                            {/* Dot */}
                                            <View
                                                style={[
                                                    styles.dot,
                                                    step === 2 && { backgroundColor: CommonColors.primary },
                                                ]}
                                            ></View>
                                        </View>

                                        {/* Text Column */}
                                        <View style={[styles.textColumn, { marginLeft: 10 }]}>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    step === 2 && { color: CommonColors.primary, fontWeight: '500' },
                                                ]}
                                            >
                                                {selectedWard ? selectedWard.name : 'Chọn Phường/Xã'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {/* Animated Active Border */}
                            <Animated.View
                                style={[
                                    styles.activeBorder,
                                    {
                                        top: animatedTop.interpolate({
                                            inputRange: [0, 2 * 50],
                                            outputRange: [0, 2 * 50], /** Điều chỉnh để căn giữa */
                                        }),
                                    },
                                ]}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 12, paddingLeft: 10 }}>
                        {renderNameStep(step)}
                    </View>
                    {renderStep(step)}

                </View>
            </CustomBottomSheet>
        </View>
    )
}

const styles = AddressStyle;

export default AddressScreen;