import { Dimensions, FlatList, Image, StyleSheet, View, ViewToken } from "react-native"
import PaginationComponent from "../pagination/pagination.comp";
import { useRef, useState } from "react";

type Props = {
    images: string[]
}

const width = Dimensions.get('window').width;

const ImageSliderComponent = ({ images }: Props) => {

    const [paginationIndex, setPaginationIndex] = useState(0);

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems[0].index !== undefined && viewableItems[0].index !== null) {
            setPaginationIndex(viewableItems[0].index % images.length);
        }
    }

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    }

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged }
    ])

    return (
        <View>
            <FlatList
                data={images}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                keyExtractor={(item) => item}
                renderItem={({ index, item }) => (
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: item }}
                            style={styles.imageItem}
                        />
                    </View>
                )}
                scrollEventThrottle={16}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
            />
            <PaginationComponent
                items={images}
                paginationIndex={paginationIndex}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imageWrapper: {
        width: width
    },
    imageItem: {
        width: '100%',
        height: 300,
        borderRadius: 10
    }
});

export default ImageSliderComponent;