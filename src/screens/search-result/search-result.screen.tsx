import { FlatList, Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements"
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppConfig } from "@/src/common/config/app.config";
import { CommonColors } from "@/src/common/resource/colors";
import SearchResultStyle from "./search-result.style";
import { useRoute } from "@react-navigation/native";

type Props = {

}

const SearchResultScreen = (props: Props) => {
    const { search: SEARCH_PARAMS } = useRoute().params as {
        search: string
    }
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPreImage();

    }, [])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }



    const onRefresh = async () => {
        setRefreshing(true);
        setRefreshing(false);
    }

    const headerHeight = useHeaderHeight();
    return (
        <>
            <View style={{ backgroundColor: 'red' }}>
                <Text>Header</Text>
            </View>
            <ScrollView>
                <View>
                    <Text>Content: {SEARCH_PARAMS}</Text>
                </View>
            </ScrollView>
        </>
    );
};

const styles = SearchResultStyle;

export default SearchResultScreen;
