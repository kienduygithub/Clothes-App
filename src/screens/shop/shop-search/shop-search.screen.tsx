import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ShopSearchStyle from "./shop-search.style";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { useState } from "react";
import { CommonColors } from "@/src/common/resource/colors";
import { router } from "expo-router";

type Props = {}

const ShopSearchScreen = (props: Props) => {
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
        </>
    )
}

const styles = ShopSearchStyle;

export default ShopSearchScreen;