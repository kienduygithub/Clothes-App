import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as AddressManagement from '@/src/data/management/address.management';
import { useToast } from '@/src/customize/toast.context';
import { CityModel, DistrictModel, WardModel } from '@/src/data/model/address.model';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AddressType } from '@/src/common/resource/address';
import CRUAddressStyle from './cru-address.style';
import CustomBottomSheet from '@/src/components/custom-bottom-sheet/custom-bottom-sheet.component';

type FormData = {
    name: string;
    phone: string;
    province: number;
    district: number;
    ward: number;
    address_details: string;
    address_type: string;
};

type Props = {};

const CRUAddressScreen = (props: Props) => {
    const { showToast } = useToast();
    const [cities, setCities] = useState<CityModel[]>([]);
    const [districts, setDistricts] = useState<DistrictModel[]>([]);
    const [wards, setWards] = useState<WardModel[]>([]);
    const [step, setStep] = useState<'province' | 'district' | 'ward'>('province');
    const [selectedProvince, setSelectedProvince] = useState<CityModel | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictModel | null>(null);
    const [selectedWard, setSelectedWard] = useState<WardModel | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            phone: '',
            province: -1,
            district: -1,
            ward: -1,
            address_details: '',
            address_type: AddressType.HOUSE,
        },
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const province = watch('province');
    const district = watch('district');
    const ward = watch('ward');
    const address_type = watch('address_type');

    // Animation for active step
    const fadeAnimProvince = useRef(new Animated.Value(1)).current;
    const fadeAnimDistrict = useRef(new Animated.Value(1)).current;
    const fadeAnimWard = useRef(new Animated.Value(1)).current;

    const openAddressBottomSheet = () => {
        setIsBottomSheetVisible(true);
    };

    const closeAddressBottomSheet = () => {
        setIsBottomSheetVisible(false);
    };

    useEffect(() => {
        fetchCities();
    }, []);

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
            setValue('province', city.id, { shouldValidate: true });
            setSelectedProvince(city);
            setDistricts([]);
            setWards([]);
            if (!selectedDistrict) {
                setValue('district', -1, { shouldValidate: true });
                setValue('ward', -1, { shouldValidate: true });
                setSelectedDistrict(null);
                setSelectedWard(null);
            }
            await fetchDistrictsByCityId(city.id);
            setStep('district');
            animateStep('district');
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleDistrictSelect = async (dist: DistrictModel) => {
        try {
            setValue('district', dist.id, { shouldValidate: true });
            setSelectedDistrict(dist);
            setWards([]);
            if (!selectedWard) {
                setValue('ward', -1, { shouldValidate: true });
                setSelectedWard(null);
            }
            await fetchWardsByDistrictId(dist.id);
            setStep('ward');
            animateStep('ward');
        } catch (error) {
            console.log(error);
            showToast('Oops! Hệ thống đang bận, quay lại sau', 'error');
        }
    };

    const handleWardSelect = (ward: WardModel) => {
        setValue('ward', ward.id, { shouldValidate: true });
        setSelectedWard(ward);
        closeAddressBottomSheet();
    };

    const handleBreadcrumbPress = (targetStep: 'province' | 'district') => {
        if (targetStep === 'province') {
            setStep('province');
            animateStep('province');
        } else if (targetStep === 'district') {
            setStep('district');
            animateStep('district');
        }
    };

    const handleReset = () => {
        setStep('province');
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setValue('province', -1, { shouldValidate: true });
        setValue('district', -1, { shouldValidate: true });
        setValue('ward', -1, { shouldValidate: true });
        setDistricts([]);
        setWards([]);
        animateStep('province');
    };

    const animateStep = (activeStep: 'province' | 'district' | 'ward') => {
        const animations = [
            Animated.timing(fadeAnimProvince, {
                toValue: activeStep === 'province' ? 1 : 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnimDistrict, {
                toValue: activeStep === 'district' ? 1 : 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnimWard, {
                toValue: activeStep === 'ward' ? 1 : 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
        ];
        Animated.parallel(animations).start();
    };

    const onSubmit = (data: FormData) => {
        const formData = {
            ...data,
            phone: `+84${data.phone}`,
        };
        console.log('Form data:', formData);
        showToast('Địa chỉ đã được lưu!', 'success');
        router.back();
    };

    const getFullAddress = () => {
        const parts = [];
        if (selectedWard) parts.push(selectedWard.name);
        if (selectedDistrict) parts.push(selectedDistrict.name);
        if (selectedProvince) parts.push(selectedProvince.name);
        return parts.length > 0 ? parts.join(', ') : 'Chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã';
    };

    const renderStep = (currentStep: 'province' | 'district' | 'ward') => {
        if (currentStep === 'province') {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.sectionTitle}>Tỉnh/Thành phố</Text>
                    {cities.map((item) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={styles.listItem}
                            onPress={() => handleProvinceSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else if (currentStep === 'district') {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.sectionTitle}>Quận/Huyện</Text>
                    {districts.map((item) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={styles.listItem}
                            onPress={() => handleDistrictSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else if (currentStep === 'ward') {
            return (
                <View style={styles.stepContainer}>
                    <Text style={styles.sectionTitle}>Phường/Xã</Text>
                    {wards.map((item) => (
                        <TouchableOpacity
                            key={item.id.toString()}
                            style={styles.listItem}
                            onPress={() => handleWardSelect(item)}
                        >
                            <Text style={styles.listItemText}>{item.name}</Text>
                            {ward === item.id && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
        return null;
    };

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
                                autoComplete="off"
                                autoCorrect={false}
                                spellCheck={false}
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
                <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
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
                                autoComplete="off"
                                autoCorrect={false}
                                spellCheck={false}
                            />
                        )}
                    />
                </View>
                {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

                {/* Tỉnh/Thành phố, Quận/Huyện, Phường/Xã */}
                <Text style={styles.label}>Tỉnh/Thành phố, Quận/Huyện, Phường/Xã *</Text>
                <TouchableOpacity onPress={openAddressBottomSheet}>
                    <View
                        style={[
                            styles.inputContainer,
                            (errors.province || errors.district || errors.ward) && styles.inputError,
                        ]}
                    >
                        <Text style={styles.addressText}>{getFullAddress()}</Text>
                        <Ionicons name="chevron-forward" size={20} color="black" />
                    </View>
                </TouchableOpacity>
                {(errors.province || errors.district || errors.ward) && (
                    <Text style={styles.error}>Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã</Text>
                )}

                {/* Tên đường/tòa nhà */}
                <Text style={styles.label}>Tên đường/tòa nhà *</Text>
                <View style={[styles.inputContainer, errors.address_details && styles.inputError]}>
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
                                autoComplete="off"
                                autoCorrect={false}
                                spellCheck={false}
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
                        <Text
                            style={[styles.addressTypeText, address_type === AddressType.HOUSE && styles.addressTypeTextSelected]}
                        >
                            Nhà
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addressTypeButton, address_type === AddressType.OFFICE && styles.addressTypeSelected]}
                        onPress={() => setValue('address_type', AddressType.OFFICE, { shouldValidate: true })}
                    >
                        <Text
                            style={[styles.addressTypeText, address_type === AddressType.OFFICE && styles.addressTypeTextSelected]}
                        >
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

            {/* Custom Bottom Sheet */}
            <CustomBottomSheet isVisible={isBottomSheetVisible} onClose={closeAddressBottomSheet}>
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.breadcrumbText}>Khu vực được chọn</Text>
                        <TouchableOpacity onPress={handleReset}>
                            <Text style={styles.resetButton}>Thiết lập lại</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.breadcrumb}>
                        {selectedProvince && (
                            <TouchableOpacity onPress={() => handleBreadcrumbPress('province')}>
                                <Animated.View style={{ opacity: fadeAnimProvince, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.breadcrumbDot, step === 'province' && styles.breadcrumbDotActive]} />
                                    <Text
                                        style={[styles.breadcrumbText, step === 'province' && styles.breadcrumbTextActive]}
                                    >
                                        {selectedProvince.name}
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                        )}
                        {selectedDistrict && (
                            <>
                                <Text style={styles.breadcrumbArrow}>•</Text>
                                <TouchableOpacity onPress={() => handleBreadcrumbPress('district')}>
                                    <Animated.View style={{ opacity: fadeAnimDistrict, flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={[styles.breadcrumbDot, step === 'district' && styles.breadcrumbDotActive]} />
                                        <Text
                                            style={[styles.breadcrumbText, step === 'district' && styles.breadcrumbTextActive]}
                                        >
                                            {selectedDistrict.name}
                                        </Text>
                                    </Animated.View>
                                </TouchableOpacity>
                            </>
                        )}
                        {step === 'ward' && selectedProvince && selectedDistrict && (
                            <>
                                <Text style={styles.breadcrumbArrow}>•</Text>
                                <Animated.View style={{ opacity: fadeAnimWard, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.breadcrumbDot, styles.breadcrumbDotActive]} />
                                    <Text style={[styles.breadcrumbText, styles.breadcrumbTextActive]}>
                                        Chọn Phường/Xã
                                    </Text>
                                </Animated.View>
                            </>
                        )}
                    </View>
                    <View style={styles.stepsContainer}>
                        {renderStep('province')}
                        {selectedProvince && renderStep('district')}
                        {selectedDistrict && renderStep('ward')}
                    </View>
                </View>
            </CustomBottomSheet>
        </>
    );
};

const styles = CRUAddressStyle;

export default CRUAddressScreen;