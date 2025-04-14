import { FlatList, Text, TextInput, View } from "react-native"
import CRUAddressStyle from "./cru-address.style";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { AddressType } from "@/src/common/resource/address";
import * as AddressManagement from "@/src/data/management/address.management";
import { useToast } from "@/src/customize/toast.context";
import { CityModel, DistrictModel, WardModel } from "@/src/data/model/address.model";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

type FormData = {
    name: string;
    phone: string;
    province: number;
    district: number;
    ward: number;
    address_details: string;
    address_type: string;
}

type Props = {}

const CRUAddressScreen = (props: Props) => {
    const { showToast } = useToast();
    const [cities, setCities] = useState<CityModel[]>([]);
    const [districts, setDistricts] = useState<DistrictModel[]>([]);
    const [wards, setWards] = useState<WardModel[]>([]);
    const [step, setStep] = useState<'province' | 'district' | 'ward'>('province');
    const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
    const [selectedDistrictName, setSelectedDistrictName] = useState<string>('');

    const {
        control,
        handleSubmit,
        formState: { errors, dirtyFields },
        setValue,
        watch,
        resetField
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: '',
            province: -1,
            district: -1,
            ward: -1,
            address_details: '',
            address_type: AddressType.HOUSE
        },
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    const province = watch('province');
    const district = watch('district');
    const address_type = watch('address_type');

    useEffect(() => {
        fetchCities();
    }, [])

    const fetchCities = async () => {
        try {
            const response = await AddressManagement.fetchCities();
            setCities(response);
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }

    const fetchDistrictsByCityId = async (cityId: number) => {
        try {
            const response = await AddressManagement.fetchDistrictsByCityId(cityId);
            setDistricts(response);
        } catch (error) {
            throw error;
        }
    };

    const fetchWardsByDistrictId = async (districtId: number) => {
        try {
            const response = await AddressManagement.fetchWardsByDistrictId(districtId);
            setWards(response);
        } catch (error) {
            throw error;
        }
    };

    const handleProvinceSelect = async (city: CityModel) => {
        try {
            setValue('province', city.id);
            setValue('district', -1);
            setValue('ward', -1);
            setSelectedProvinceName(city.name);
            setDistricts([]);
            setWards([]);
            await fetchDistrictsByCityId(city.id);
            setStep('district');
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    }

    const handleDistrictSelect = async (dist: DistrictModel) => {
        try {
            setValue('district', dist.id);
            setValue('ward', -1);
            setSelectedDistrictName(dist.name);
            setWards([]);
            await fetchWardsByDistrictId(dist.id);
            setStep('ward');
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleWardSelect = (ward: WardModel) => {
        setValue('ward', ward.id);
    };

    const handleBack = () => {
        if (step === 'ward') {
            setStep('district');
            setValue('ward', -1);
        } else if (step === 'district') {
            setStep('province');
            setValue('district', -1);
            setValue('ward', -1);
            setDistricts([]);
            setWards([]);
        }
    };

    const onSubmit = (data: FormData) => {
        const formData = {
            ...data,
            phone: `+84${data.phone}`,
        };
        console.log('Form data:', formData);
        showToast('Địa chỉ đã được lưu!', 'success');
    };

    console.log(control.getFieldState("phone"));
    return (
        <>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>Thêm địa chỉ mới</Text>
            </View>

            <View style={styles.container}>
                {/* Tên nguồn nhận */}
                <Text style={styles.label}>Tên nguồn nhận *</Text>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: 'Tên nguồn nhận là bắt buộc' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                value={value}
                                onChangeText={(text) => onChange(text)}
                                onBlur={onBlur}
                                placeholder="Nhập tên nguồn nhận"
                                autoComplete="off" // Tắt autocomplete
                                autoCorrect={false} // Tắt tự động sửa lỗi
                                spellCheck={false} // Tắt kiểm tra chính tả
                            />
                        )}
                    />
                    <View style={styles.icon}>
                        <FontAwesome5 name="user-alt" size={16} color="black" />
                    </View>
                </View>
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                {/* Số điện thoại */}
                <Text style={styles.label}>Số điện thoại *</Text>
                <View
                    style={[
                        styles.inputContainer,
                        errors.phone && styles.inputError, // Thêm viền đỏ khi có lỗi
                    ]}
                >
                    <View style={styles.phonePrefix}>
                        <Text style={styles.phonePrefixText}>+84</Text>
                    </View>
                    <Controller
                        control={control}
                        name="phone"
                        rules={{
                            required: 'Số điện thoại là bắt buộc',
                            pattern: {
                                value: /^[0-9]{9}$/,
                                message: 'Số điện thoại phải có đúng 9 chữ số (không tính +84)',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, styles.phoneInput]}
                                value={value}
                                onChangeText={(text) => onChange(text)}
                                onBlur={onBlur}
                                keyboardType="phone-pad"
                                placeholder="Nhập số điện thoại"
                                maxLength={9}
                            />
                        )}
                    />
                </View>
                {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

                {/* Chọn địa chỉ phân cấp */}
                <Text style={styles.label}>Thành phố *</Text>
                <View
                    style={[
                        styles.locationContainer,
                        (errors.province || errors.district || errors.ward) && styles.inputError, // Thêm viền đỏ khi có lỗi
                    ]}
                >
                    <View style={styles.breadcrumb}>
                        {selectedProvinceName && (
                            <>
                                <Text style={styles.breadcrumbArrow}>•</Text>
                                <Text style={styles.breadcrumbText}>{selectedProvinceName}</Text>
                            </>
                        )}
                        {selectedDistrictName && (
                            <>
                                <Text style={styles.breadcrumbArrow}>•</Text>
                                <Text style={styles.breadcrumbText}>{selectedDistrictName}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.listContainer}>
                        {step !== 'province' && (
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Text style={styles.backButtonText}>←</Text>
                            </TouchableOpacity>
                        )}

                        {step === 'province' && (
                            <FlatList
                                data={cities}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => handleProvinceSelect(item)}
                                    >
                                        <Text style={styles.listItemText}>{item.name}</Text>
                                        {province === item.id && <Text style={styles.checkmark}>✓</Text>}
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        {step === 'district' && (
                            <FlatList
                                data={districts}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => handleDistrictSelect(item)}
                                    >
                                        <Text style={styles.listItemText}>{item.name}</Text>
                                        {district === item.id && <Text style={styles.checkmark}>✓</Text>}
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        {step === 'ward' && (
                            <FlatList
                                data={wards}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        onPress={() => handleWardSelect(item)}
                                    >
                                        <Text style={styles.listItemText}>{item.name}</Text>
                                        {watch('ward') === item.id && <Text style={styles.checkmark}>✓</Text>}
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </View>
                {(errors.province || errors.district || errors.ward) && (
                    <Text style={styles.error}>
                        {errors.province?.message || errors.district?.message || errors.ward?.message}
                    </Text>
                )}

                {/* Tên đường/tòa nhà */}
                <Text style={styles.label}>Tên đường/tòa nhà *</Text>
                <View
                    style={[
                        styles.inputContainer,
                        errors.address_details && styles.inputError, // Thêm viền đỏ khi có lỗi
                    ]}
                >
                    <Controller
                        control={control}
                        name="address_details"
                        rules={{ required: 'Tên đường/tòa nhà là bắt buộc' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                value={value}
                                onChangeText={(text) => onChange(text)}
                                onBlur={onBlur}
                                placeholder="Nhập tên đường/tòa nhà"
                            />
                        )}
                    />
                </View>
                {errors.address_details && <Text style={styles.error}>{errors.address_details.message}</Text>}

                {/* Loại địa chỉ */}
                <Text style={styles.label}>Loại địa chỉ *</Text>
                <View style={styles.addressTypeContainer}>
                    <TouchableOpacity
                        style={[styles.addressTypeButton, address_type === AddressType.HOUSE && styles.addressTypeSelected]}
                        onPress={() => setValue('address_type', AddressType.HOUSE, { shouldValidate: true })}
                    >
                        <Text style={[styles.addressTypeText, address_type === AddressType.HOUSE && styles.addressTypeTextSelected]}>
                            Nhà
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addressTypeButton, address_type === AddressType.OFFICE && styles.addressTypeSelected]}
                        onPress={() => setValue('address_type', AddressType.OFFICE, { shouldValidate: true })}
                    >
                        <Text style={[styles.addressTypeText, address_type === AddressType.OFFICE && styles.addressTypeTextSelected]}>
                            Văn phòng
                        </Text>
                    </TouchableOpacity>
                </View>
                {errors.address_type && <Text style={styles.error}>{errors.address_type.message}</Text>}

                {/* Nút Lưu */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = CRUAddressStyle;

export default CRUAddressScreen;