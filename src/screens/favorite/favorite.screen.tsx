import { Text, View } from "react-native"
import FavoriteStyle from "./favorite.style"
import * as UserActions from '@/src/data/store/actions/user/user.action'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/src/data/types/global"
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer"
import { useEffect, useState } from "react"
import { ProductModel } from "@/src/data/model/product.model"
import { AppConfig } from "@/src/common/config/app.config"

const FavoriteScreen = () => {
    const preImage = new AppConfig().getPreImage();
    const [productFavorites, setProductFavorites] = useState<ProductModel[]>([]);
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();

    useEffect(() => {

    }, [])

    return (
        <View>
            <Text>Favorite Screen</Text>
        </View>
    )
}

const styles = FavoriteStyle;

export default FavoriteScreen;