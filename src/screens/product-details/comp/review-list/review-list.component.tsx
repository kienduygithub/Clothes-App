import { CommonColors } from "@/src/common/resource/colors";
import { formatDate } from "@/src/common/utils/time.helper";
import { ProductModel } from "@/src/data/model/product.model";
import { ProductReviewModel } from "@/src/data/model/review.model";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";

type Props = {
    preImage: string,
    product: ProductModel,
    reviews: ProductReviewModel[],
    totalItems: number,
}

const ReviewListComponent = ({
    preImage,
    product,
    reviews = [],
    totalItems = 0
}: Props) => {

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i <= rating ? "star" : "star-o"}
                    size={16}
                    color={CommonColors.yellow}
                    style={{ marginRight: 4 }}
                />
            );
        }
        return stars;
    };

    const navigateToAllReviewScreen = () => {

    }

    return (
        <View style={reviewStyles.reviewWrapper}>
            <TouchableOpacity onPress={navigateToAllReviewScreen} style={[reviewStyles.reviewHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <View>
                    <Text style={reviewStyles.reviewTitle}>Đánh giá sản phẩm</Text>
                    <View style={reviewStyles.ratingSummary}>
                        <Text style={reviewStyles.ratingText}>{Number(product.rating).toFixed(1)}/5.0</Text>
                        <View style={reviewStyles.stars}>
                            {renderStars(Number(product.rating))}
                        </View>
                        <Text style={reviewStyles.reviewCount}>({totalItems} đánh giá)</Text>
                    </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
            {reviews.slice(0, 2).map((review) => (
                <View key={review.id} style={reviewStyles.reviewItem}>
                    <View style={reviewStyles.reviewUser}>
                        <View style={reviewStyles.avatar}>
                            <Image style={{ width: '100%', height: '100%' }} source={{ uri: `${preImage}/${review.user?.image_url}` }} />
                        </View>
                        <View style={reviewStyles.userDetails}>
                            <Text style={reviewStyles.userName}>{review.user?.name === '' ? 'Anonymous' : review.user?.name}</Text>
                            <View style={reviewStyles.starContainer}>{renderStars(review.review?.rating ?? 0)}</View>
                        </View>
                    </View>
                    <Text style={reviewStyles.reviewComment}>{review.review?.comment}</Text>
                    <Text style={reviewStyles.reviewDate}>{formatDate(new Date(review.review?.created_at ?? new Date()))}</Text>
                </View>
            ))}
        </View>
    )
}

const reviewStyles = StyleSheet.create({
    reviewWrapper: {
        paddingVertical: 12,
        backgroundColor: CommonColors.white,
    },
    reviewHeader: {
        marginBottom: 12,
        paddingHorizontal: 16
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 20,
        fontWeight: '700',
        color: CommonColors.primary,
        marginRight: 8,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    reviewItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#34D399',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        overflow: 'hidden',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    starContainer: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 14,
        color: '#1F2937',
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    viewMoreButton: {
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: CommonColors.primary,
        alignItems: 'center',
    },
    viewMoreText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ReviewListComponent;