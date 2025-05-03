import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { useToast } from "@/src/customize/toast.context";
import { AppConfig } from "@/src/common/config/app.config";
import { formatDate } from "@/src/common/utils/time.helper";
import { router } from "expo-router";
import { mockReviews } from "@/src/data/json/review.data-json";
import ReviewStyle from "./review.style";
import { ProductReviewModel } from "@/src/data/model/review.model";
import * as ReviewManagement from "@/src/data/management/review.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { MessageError } from "@/src/common/resource/message-error";

const ReviewScreen = () => {
    const preImage = new AppConfig().getPreImage();
    const { showToast } = useToast();
    const tabs = ["Chưa đánh giá", "Đã đánh giá"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [displayReviews, setDisplayReviews] = useState<any[]>([]);
    const [unreviewedPurchases, setUnreviewedPurchases] = useState<ProductReviewModel[]>([]);
    const [reviewedPurchases, setReviewedPurchases] = useState<ProductReviewModel[]>([]);
    const [loading, setLoading] = useState(false);
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();
    useEffect(() => {
        fetchUnreviewedPurchases();
        fetchReviews();
    }, []);

    const fetchUnreviewedPurchases = async () => {
        try {
            const unreviewedSource = await ReviewManagement.fetchListUnreviewPurchaseUser();
            setUnreviewedPurchases(unreviewedSource);
            setDisplayReviews(unreviewedSource);
        } catch (error) {
            console.log('ReviewScreen 24: ', error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const fetchReviews = async () => {
        try {
            setReviews(mockReviews);
            filterReviews(tabs[0]);
        } catch (error) {
            console.log('ReviewScreen 24: ', error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    };

    const filterReviews = (tab: string) => {
        setActiveTab(tab);
        if (tab === "Chưa đánh giá") {
            setDisplayReviews(reviews.filter(review => !review.rating));
        } else {
            setDisplayReviews(reviews.filter(review => review.rating));
        }
    };

    const renderTab = (tab: string) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => filterReviews(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                {tab}
            </Text>
        </TouchableOpacity>
    );

    const renderPendingReviewItem = ({ item, index }: { item: ProductReviewModel, index: number }) => {
        return (
            <View key={`${item.id}-${index}`}>
                <TouchableOpacity style={styles.pendingReviewCard} onPress={() => { /* Chuyển đến form đánh giá */ }}>
                    <Image
                        style={styles.productImage}
                        source={{ uri: `${preImage}/${item.image_url}` }}
                    />
                    <View style={styles.reviewContent}>
                        <Text style={styles.productName}>{item.product_name}</Text>
                        <Text style={styles.orderDate}>Đơn hàng: {formatDate(new Date(item.purchased_at ?? new Date()))}</Text>
                        <TouchableOpacity style={styles.rateButton}>
                            <Text style={styles.rateButtonText}>Đánh giá ngay</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const renderRatedReviewItem = ({ item }: { item: any }) => {
        const renderStars = (rating: number) => {
            const stars = [];
            for (let i = 0; i < 5; i++) {
                stars.push(
                    <AntDesign
                        key={i}
                        name="star"
                        size={14}
                        color={i < rating ? "#FFD700" : "#D1D5DB"}
                    />
                );
            }
            return stars;
        };

        return (
            <View style={styles.ratedReviewCard}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.user?.username?.charAt(0)}</Text>
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.user?.username}</Text>
                        <View style={styles.starContainer}>{renderStars(item.rating)}</View>
                    </View>
                </View>
                <Text style={styles.variantText}>
                    Phân loại: {item.product?.variant || "Không có phân loại"}
                </Text>
                <Text style={styles.reviewComment}>{item.comment}</Text>
                <Text style={styles.reviewDate}>{formatDate(new Date())}</Text>
                <View style={styles.productInfo}>
                    <Image
                        style={styles.ratedProductImage}
                        source={{ uri: `${preImage}/${item.product?.image}` }}
                    />
                    <Text style={styles.ratedProductName}>{item.product?.name}</Text>
                </View>
                <View style={styles.feedbackContainer}>
                    <TouchableOpacity style={styles.feedbackButton}>
                        <AntDesign name="like1" size={16} color="#6B7280" />
                        <Text style={styles.feedbackText}>Hữu ích</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <AntDesign name="star" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>
                Không có sản phẩm nào để {activeTab.toLowerCase()}
            </Text>
            <Text style={styles.emptySubText}>
                Bạn đã hoàn tất đánh giá tất cả sản phẩm.
            </Text>
            {activeTab === "Chưa đánh giá" && (
                <TouchableOpacity style={styles.viewRatedButton} onPress={() => filterReviews("Đã đánh giá")}>
                    <Text style={styles.viewRatedButtonText}>Xem các sản phẩm đã đánh giá</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={CommonColors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá của tôi</Text>
            </View>
            <View style={{ marginBottom: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                    {tabs.map(renderTab)}
                </ScrollView>
            </View>
            <FlatList
                data={displayReviews}
                renderItem={activeTab === "Chưa đánh giá" ? renderPendingReviewItem : renderRatedReviewItem}
                keyExtractor={(item, index) => activeTab === "Chưa đánh giá" ? `${item.id}-${index}` : `${item.review?.id}`}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
};

const styles = ReviewStyle;

export default ReviewScreen;