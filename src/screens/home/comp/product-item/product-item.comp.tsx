import { Image, Text, TouchableOpacity, View } from "react-native";
import ProductItemStyle from "./product-item.style";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { ProductModel } from "@/src/data/model/product.model";
import { useState } from "react";
import { formatPriceRender } from "@/src/common/utils/currency.helper";
import * as FavoriteManagement from "@/src/data/management/favorite.management";
import { useToast } from "@/src/customize/toast.context";
import { useDispatch, useSelector } from "react-redux";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { MessageError } from "@/src/common/resource/message-error";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";

type Props = {
    item: ProductModel & { isFavorite?: boolean },
    preImage: string,
    index: number;
    productType: "sale" | "regular",
};

const ProductItemComponent = ({
    item,
    index,
    preImage,
    productType,
}: Props) => {
    const { showToast } = useToast();
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const isFavorite = userSelector.favorites.includes(item.id);
    const dispatch = useDispatch();

    const favoriteProduct = async () => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.favoriteProductByUser(item.id);
            dispatch(UserActions.AddFavorite(item.id));
        } catch (error: any) {
            console.log('ProductItemComponent 39: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const unFavoriteProduct = async () => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.unfavoriteProductByUser(item.id);
            dispatch(UserActions.RemoveFavorite(item.id));
        } catch (error: any) {
            console.log('ProductItemComponent 54: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const navigateDetails = () => {
        router.navigate({
            pathname: '/(routes)/product-details',
            params: {
                id: item.id,
                shop_id: item.shop?.id ?? 0,
                productType: productType
            }
        })
    }
    return (
        <>
            {item && (
                <TouchableOpacity onPress={navigateDetails}>
                    <Animated.View key={item.id} style={styles.container} entering={FadeInDown.delay(300 + index * 100).duration(500)}>
                        <Image source={{ uri: `${preImage}/${item.product_images[0].image_url}` }} style={styles.productImg} />
                        {isFavorite ? (
                            <TouchableOpacity onPress={unFavoriteProduct} style={styles.bookmarkBtn}>
                                <FontAwesome name="heart" size={18} color={CommonColors.red} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={favoriteProduct} style={styles.bookmarkBtn}>
                                <FontAwesome name="heart-o" size={18} color={CommonColors.black} />
                            </TouchableOpacity>
                        )}
                        <View style={styles.productInfo}>
                            <Text style={styles.price}>đ{formatPriceRender(item.unit_price)}</Text>
                            <View style={styles.ratingWrapper}>
                                <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                                <Text style={styles.ratingTxt}>{Number(item.rating).toFixed(1)}</Text>
                            </View>
                        </View>
                        <Text style={styles.title}>{item.product_name}</Text>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </>
    )
}

const styles = ProductItemStyle;

export default ProductItemComponent;