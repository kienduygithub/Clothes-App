import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Address {
    name: string;
    children?: Address[];
}

const addressData: Address[] = [
    {
        name: 'An Giang',
        children: [
            { name: 'Huyện An Phú', children: [{ name: 'Thị Trấn An Phú' }, { name: 'Thị Trấn Long Bình' }] },
            { name: 'Chợ Mới' },
        ],
    },
    // Thêm dữ liệu khác nếu cần
];

const AddressPicker: React.FC = () => {
    const [selectedProvince, setSelectedProvince] = useState<Address | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<Address | null>(null);
    const [currentLevel, setCurrentLevel] = useState<'province' | 'district' | 'ward'>('province');

    // Animation values
    const provinceHighlightY = useSharedValue(0);
    const districtHighlightY = useSharedValue(0);
    const wardHighlightY = useSharedValue(0);

    const provinceHighlightStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: provinceHighlightY.value }],
    }));

    const districtHighlightStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: districtHighlightY.value }],
    }));

    const wardHighlightStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: wardHighlightY.value }],
    }));

    const handleProvinceSelect = (province: Address, index: number) => {
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setCurrentLevel('district');
        provinceHighlightY.value = withSpring(index * 50); // 50 là chiều cao mỗi item
    };

    const handleDistrictSelect = (district: Address, index: number) => {
        setSelectedDistrict(district);
        setCurrentLevel('ward');
        districtHighlightY.value = withSpring(index * 50);
    };

    const handleWardSelect = (index: number) => {
        wardHighlightY.value = withSpring(index * 50);
    };

    const renderProvinceItem = ({ item, index }: { item: Address; index: number }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleProvinceSelect(item, index)}
        >
            <Text style={styles.itemText}>{item.name}</Text>
            {selectedProvince === item && <Text style={styles.checkMark}>✔</Text>}
        </TouchableOpacity>
    );

    const renderDistrictItem = ({ item, index }: { item: Address; index: number }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleDistrictSelect(item, index)}
        >
            <Text style={styles.itemText}>{item.name}</Text>
            {selectedDistrict === item && <Text style={styles.checkMark}>✔</Text>}
        </TouchableOpacity>
    );

    const renderWardItem = ({ item, index }: { item: Address; index: number }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleWardSelect(index)}
        >
            <Text style={styles.itemText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Khu vực được chọn</Text>
                <TouchableOpacity onPress={() => setCurrentLevel('province')}>
                    <Text style={styles.headerLink}>Thiết lập lại</Text>
                </TouchableOpacity>
            </View>

            {/* Breadcrumbs */}
            <View style={styles.breadcrumbs}>
                <TouchableOpacity onPress={() => setCurrentLevel('province')}>
                    <Text style={styles.breadcrumbText}>An Giang</Text>
                </TouchableOpacity>
                {selectedProvince && (
                    <>
                        <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
                        <TouchableOpacity onPress={() => setCurrentLevel('district')}>
                            <Text style={styles.breadcrumbText}>{selectedProvince.name}</Text>
                        </TouchableOpacity>
                    </>
                )}
                {selectedDistrict && (
                    <>
                        <Text style={styles.breadcrumbSeparator}> {'>'} </Text>
                        <Text style={[styles.breadcrumbText, styles.selectedBreadcrumb]}>
                            {selectedDistrict.name}
                        </Text>
                    </>
                )}
            </View>

            {/* List */}
            {currentLevel === 'province' && (
                <>
                    <Text style={styles.levelTitle}>Tỉnh</Text>
                    <Animated.View style={[styles.highlightBorder, provinceHighlightStyle]} />
                    <FlatList
                        data={addressData}
                        renderItem={renderProvinceItem}
                        keyExtractor={(item) => item.name}
                    />
                </>
            )}

            {currentLevel === 'district' && selectedProvince?.children && (
                <>
                    <Text style={styles.levelTitle}>Huyện</Text>
                    <Animated.View style={[styles.highlightBorder, districtHighlightStyle]} />
                    <FlatList
                        data={selectedProvince.children}
                        renderItem={renderDistrictItem}
                        keyExtractor={(item) => item.name}
                    />
                </>
            )}

            {currentLevel === 'ward' && selectedDistrict?.children && (
                <>
                    <Text style={styles.levelTitle}>Phường/Xã</Text>
                    <Animated.View style={[styles.highlightBorder, wardHighlightStyle]} />
                    <FlatList
                        data={selectedDistrict.children}
                        renderItem={renderWardItem}
                        keyExtractor={(item) => item.name}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerLink: {
        fontSize: 16,
        color: '#ff4500',
    },
    breadcrumbs: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#000',
    },
    breadcrumbSeparator: {
        fontSize: 14,
        color: '#888',
    },
    selectedBreadcrumb: {
        color: '#ff4500',
    },
    levelTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    item: {
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    checkMark: {
        fontSize: 16,
        color: '#ff4500',
    },
    highlightBorder: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ff4500',
        borderRadius: 8,
        zIndex: -1,
    },
});

export default AddressPicker;