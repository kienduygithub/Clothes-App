import { CommonColors } from "@/src/common/resource/colors";
import { ProductModel } from "@/src/data/model/product.model";
import { ProductVariantModel } from "@/src/data/model/product_variant.model";
import { ColorType, SizeType } from "@/src/data/types/global";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QuantityProductComponent from "../quantity-product/quantity-product.comp";

type Props = {
    product: ProductModel,
    variants: ProductVariantModel[],
    preImage: string,
}

const SelectVariantComponent = ({
    product,
    variants,
    preImage
}: Props) => {
    const [colors, setColors] = useState<ColorType[]>([]);
    const [sizes, setSizes] = useState<SizeType[]>([]);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [stockQuantity, setStockQuantity] = useState<number>(0);
    const [displayVariantImage, setDisplayVariantImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [resetQuantity, setResetQuantity] = useState(false);

    useEffect(() => {
        const colors: ColorType[] = Array.from(new Set(variants.map(variant => variant.color?.id)))
            .map(colorId => {
                const variant = variants.find(v => v.color?.id === colorId);
                return {
                    id: variant?.color?.id ?? 0,
                    color_name: variant?.color?.color_name ?? '',
                    image_url: variant?.image_url ?? ''
                }
            })
            .filter(color => color.id !== 0);
        const sizes: SizeType[] = Array.from(new Set(variants.map(v => v.size?.id)))
            .map(sizeId => {
                const variant = variants.find(v => v.size?.id === sizeId);
                return {
                    id: variant?.size?.id ?? 0,
                    size_code: variant?.size?.size_code ?? ''
                }
            })
            .filter(size => size.id !== 0);
        setColors(colors);
        setSizes(sizes);
    }, [])

    useEffect(() => {
        if (!selectedColor && !selectedSize || !selectedColor && selectedSize) {
            const total = variants.reduce(
                (stock: number, variant: ProductVariantModel) => {
                    return stock + variant.stock_quantity;
                }, 0
            );
            setStockQuantity(total);
            setResetQuantity(true);
        } else if (selectedColor && !selectedSize) {
            const total = variants.filter(v => v.color?.id === selectedColor)
                .reduce(
                    (stock: number, variant: ProductVariantModel) => {
                        return stock + variant.stock_quantity
                    }, 0
                );
            setStockQuantity(total);
            setResetQuantity(true);
        } else if (selectedColor && selectedSize) {
            const total = variants.find(
                v => v.color?.id === selectedColor && v.size?.id === selectedSize
            )?.stock_quantity ?? 0;
            setStockQuantity(total);
            setResetQuantity(true);
        }
    }, [selectedColor, selectedSize, variants])

    const handleSelectSize = (id: number) => {
        setSelectedSize((prev) => (prev === id ? null : id));
    }

    const handleSelectColor = (id: number) => {
        setSelectedColor((prev) => (prev === id ? null : id));
    }

    const getDisplayVariantImage = () => {
        if (selectedColor) {
            const seletedVariant = variants.find(v => v.color?.id === selectedColor);
            return seletedVariant?.image_url || product?.product_images[0].image_url;
        }

        return product?.product_images[0].image_url;
    }

    return (
        <>
            <View style={styles.selectVariantWrapper}>
                {/* Info */}
                <View style={styles.selectVariantInfoWrapper}>
                    <View style={styles.selectVariantImageWrapper}>
                        <Image style={styles.selectVariantImage} source={{ uri: `${preImage}/${getDisplayVariantImage()}` }} />
                    </View>
                    <View style={styles.unitPriceAndStockWrapper}>
                        <View style={styles.unitPriceWrapper}>
                            <Text style={styles.dText}>đ</Text>
                            <Text style={styles.unitPriceText}>{product.unit_price}</Text>
                        </View>
                        <Text style={styles.stockText}>
                            Hàng tồn: {stockQuantity}
                        </Text>
                    </View>
                </View>
                <View style={styles.devider}></View>
                {/* Color */}
                <View style={styles.productVariantWrapper}>
                    <View style={styles.productVariantTypeWrapper}>
                        <Text style={styles.productVariantTitle}>Màu sắc</Text>
                        <View style={styles.productVariantValueWrapper}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={`color-${color.id}`}
                                    style={[styles.productVariantValue, selectedColor === color.id && styles.selectedVariant]}
                                    onPress={() => handleSelectColor(color.id)}
                                >
                                    <Image
                                        style={styles.productVariantImage}
                                        source={{ uri: `${preImage}/${color.image_url}` }}
                                    />
                                    <Text style={[selectedColor === color.id && styles.selectedVariantText]}>
                                        {color.color_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.devider}></View>
                {/* Size */}
                <View style={styles.productVariantWrapper}>
                    <View style={styles.productVariantTypeWrapper}>
                        <Text style={styles.productVariantTitle}>Kích cỡ</Text>
                        <View style={styles.productVariantValueWrapper}>
                            {sizes.map((size) => (
                                <TouchableOpacity
                                    key={`size-${size.size_code}`}
                                    style={[styles.productVariantValue, selectedSize === size.id && styles.selectedVariant]}
                                    onPress={() => handleSelectSize(size.id)}
                                >
                                    <Text style={[selectedSize === size.id && styles.selectedVariantText]}>Size {size.size_code}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.devider}></View>
                {/* Quantity */}
                <View style={styles.quantityWrapper}>
                    <QuantityProductComponent
                        initialQuantity={quantity}
                        min={1}
                        max={stockQuantity}
                        onQuantityChange={setQuantity}
                        resetQuantity={resetQuantity}
                        setResetQuantity={setResetQuantity}
                    />
                </View>
                <View style={styles.devider}></View>
                {/* Button */}
                <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity style={styles.buttonAddCart}>
                        <Text style={styles.buttonAddCartText}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    devider: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.16)'
    },
    selectVariantWrapper: {
        gap: 10
    },
    selectVariantInfoWrapper: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        gap: 15
    },
    selectVariantImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    selectVariantImage: {
        width: '100%',
        height: '100%'
    },
    unitPriceAndStockWrapper: {

    },
    unitPriceWrapper: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    dText: {
        fontSize: 15,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    unitPriceText: {
        fontSize: 20,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    stockText: {
        fontSize: 16,
        color: CommonColors.gray
    },
    productVariantWrapper: {
        paddingHorizontal: 20
    },
    productVariantTypeWrapper: {
        gap: 10
    },
    productVariantTitle: {
        fontSize: 16
    },
    productVariantValueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    productVariantValue: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1.5,
        borderColor: CommonColors.lightGray,
        borderRadius: 5,
    },
    productVariantImage: {
        width: 30,
        height: 30,
        resizeMode: 'stretch'
    },
    selectedVariant: {
        borderColor: CommonColors.primary
    },
    selectedVariantText: {
        color: CommonColors.primary
    },
    quantityWrapper: {
        paddingHorizontal: 20,
        alignItems: 'flex-end'
    },
    buttonAddCart: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CommonColors.primary,
        borderRadius: 5
    },
    buttonAddCartText: {
        fontSize: 16,
        color: CommonColors.white,
        fontWeight: '500'
    }
})

export default SelectVariantComponent;