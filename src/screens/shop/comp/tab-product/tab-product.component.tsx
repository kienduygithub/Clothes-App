import { CommonColors } from "@/src/common/resource/colors"
import { ScrollView, StyleSheet, Text, View } from "react-native"

type Props = {
    shop_id: number
}

const TabProductComponent = ({
    shop_id
}: Props) => {

    return (
        <ScrollView style={styles.container}>
            <Text>Product Content</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: CommonColors.extraLightGray
    }
})

export default TabProductComponent;