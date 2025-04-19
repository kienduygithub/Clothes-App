import { CommonColors } from "@/src/common/resource/colors";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const ShopScreen = (props: Props) => {
    const [searchInput, setSearchInput] = useState('');

    return (
        <>
            {/* Header */}
            <View style={[styles.headerContainer]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Octicons name="search" size={18} color={CommonColors.white} />
                    <TextInput
                        value={searchInput}
                        onChangeText={(text: string) => setSearchInput(text)}
                        placeholder="Tìm kiếm sản phẩm trong cửa hàng"
                    />
                </View>
            </View>
            <View>
                <Text>Shop Screen</Text>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    /** Header */
    headerContainer: {
        width: WIDTH_SCREEN,
        height: 100,
        backgroundColor: 'transparent',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        position: 'absolute'
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    searchContainer: {
        width: WIDTH_SCREEN * 0.8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 5,
        gap: 10,
        marginLeft: 18
    },
    /** Shop */
})

export default ShopScreen;