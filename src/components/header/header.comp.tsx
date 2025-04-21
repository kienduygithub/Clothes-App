import { Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "./header.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { Link } from "expo-router";
import { useState } from "react";

type Props = {
    openSearch: () => void
};

const HeaderComponent = (props: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.logo}>FZ</Text>
            <TouchableOpacity onPress={props.openSearch} style={styles.searchBar}>
                <Text style={styles.searchTxt}>Tìm kiếm sản phẩm</Text>
                <FontAwesome name="search" size={20} color={CommonColors.gray} />
            </TouchableOpacity>
        </View>
    )
}

const styles = HeaderStyle;

export default HeaderComponent;