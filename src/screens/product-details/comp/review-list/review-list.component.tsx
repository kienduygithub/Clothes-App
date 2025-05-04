import { CommonColors } from "@/src/common/resource/colors";
import { formatDate } from "@/src/common/utils/time.helper";
import { ProductModel } from "@/src/data/model/product.model";
import { ProductReviewModel } from "@/src/data/model/review.model";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text } from "react-native";
import { StyleSheet, View } from "react-native";

type Props = {
    preImage: string,
    product: ProductModel,
    reviews: ProductReviewModel[],
    totalReviews: number,
}

const ReviewListComponent = ({
    preImage,
    product,
    reviews = [],
    totalReviews = 0
}: Props) => {

    const ratingDistribution = {
        1: 1,
        2: 4,
        3: 15,
        4: 40,
        5: 80,
    };

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

    const renderFullStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= rating; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name="star"
                    size={14}
                    color={CommonColors.yellow}
                />
            );
        }
        return <Text>{stars}</Text>;
    };

    const renderRatingDistribution = () => {
        return (
            <View style={reviewStyles.ratingDistribution}>
                <View style={{ borderRightWidth: 1, borderRightColor: CommonColors.extraLightGray, paddingRight: 16 }}>
                    <View style={[reviewStyles.ratingAverage, { alignItems: 'center' }]}>
                        <Text style={reviewStyles.ratingText}>{Number(product.rating).toFixed(1)}</Text>
                        <View style={reviewStyles.stars}>
                            {renderStars(Number(product.rating))}
                        </View>
                        <Text style={reviewStyles.reviewCount}>({totalReviews} đánh giá)</Text>
                    </View>
                </View>
                <View style={{ paddingLeft: 16 }}>
                    {Object.entries(ratingDistribution).map(([stars, count]) => (
                        <View key={stars} style={reviewStyles.ratingRow}>
                            <Text>{stars}</Text>
                            <View style={reviewStyles.ratingLabel}>
                                {renderFullStars(Number(stars))}
                            </View>
                            <Text style={reviewStyles.ratingCountText}>({count} đánh giá)</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={reviewStyles.reviewWrapper}>
            <View style={reviewStyles.reviewHeader}>
                <Text style={reviewStyles.reviewTitle}>Đánh giá sản phẩm</Text>
                {renderRatingDistribution()}
            </View>
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
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: CommonColors.primary,
        marginBottom: 8,
    },
    ratingDistribution: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    totalReviews: {
        flex: 1,
    },
    reviewCount: {
        fontSize: 14,
        color: CommonColors.black,
    },
    ratingAverage: {
        alignItems: 'baseline',
    },
    ratingText: {
        fontSize: 60,
        fontWeight: '700',
        color: CommonColors.black,
    },
    stars: {
        flexDirection: 'row',
    },
    ratingLabel: {
        flexDirection: 'row',
    },

    ratingCountText: {
        fontSize: 12,
        color: '#1F2937',
        fontWeight: '600',
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
});

export default ReviewListComponent;