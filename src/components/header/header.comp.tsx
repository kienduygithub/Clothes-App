import { Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "./header.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { Link } from "expo-router";

type Props = {};

const HeaderComponent = (props: Props) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.logo}>FZ</Text>
            <Link href={'/(tabs)/search'} asChild>
                <TouchableOpacity style={styles.searchBar}>
                    <Text style={styles.searchTxt}>Search</Text>
                    <FontAwesome name="search" size={20} color={CommonColors.gray} />
                </TouchableOpacity>
            </Link>
        </View>
    )
}

const styles = HeaderStyle;

export default HeaderComponent;