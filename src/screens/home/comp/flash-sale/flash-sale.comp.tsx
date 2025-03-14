import { FlatList, Text, TouchableOpacity, View } from "react-native"
import FlashSaleComponentStyle from "./flash-sale.style"
import { FontAwesome } from "@expo/vector-icons"
import { CommonColors } from "@/src/common/resource/colors"
import { useEffect, useState } from "react"
import { ProductType } from "@/src/data/types/global"
import ProductItemComponent from "../product-item/product-item.comp"

type Props = {
    products: ProductType[]
}

const FlashSaleComponent = ({ products }: Props) => {
    const saleEndDate = new Date();
    saleEndDate.setFullYear(2025, 2, 13);
    // saleEndDate.setDate(saleEndDate.getDate() + 2);
    saleEndDate.setHours(23, 59, 59);

    const [timeUnits, setTimeUnits] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeUnits = (timeDifference: number) => {
            const seconds = Math.floor(timeDifference / 1000);
            setTimeUnits({
                days: Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60)),
                hours: Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
                minutes: Math.floor((seconds % (60 * 60)) / 60),
                seconds: seconds % 60
            })
        }

        const updateCountdown = () => {
            const currentDate = new Date().getTime();
            const expiryTime = saleEndDate.getTime();
            const timeDifference = expiryTime - currentDate;

            if (timeDifference <= 0) {
                // Countdown finished
                calculateTimeUnits(0);
            } else {
                calculateTimeUnits(timeDifference)
            }
        }

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [])

    const formatTime = (time: number) => {
        return time.toString().padStart(2, '0');
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <View style={styles.timerWrapper}>
                    <Text style={styles.title}>Flash Sale</Text>
                    <View style={styles.timer}>
                        <FontAwesome name="clock-o" size={16} color={CommonColors.black} />
                        <Text style={styles.timerTxt}>
                            {`${formatTime(timeUnits.days)}:${formatTime(timeUnits.hours)}:${formatTime(timeUnits.minutes)}:${formatTime(timeUnits.seconds)}`}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Text style={styles.titleBtn}>Tất cả</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={products}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ marginLeft: 20, paddingRight: 20 }}
                keyExtractor={(item) => `${item.id}`}
                renderItem={
                    ({ index, item }) => (
                        <View style={{ marginRight: 10 }}>
                            <ProductItemComponent item={item} index={index} productType="sale" />
                        </View>
                    )
                }
            />
        </View>
    )
}

const styles = FlashSaleComponentStyle;

export default FlashSaleComponent;