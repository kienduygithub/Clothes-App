import React, { useRef, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number;
}

const BottomSheetComponent: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.5,
}) => {
    const adjustedScreenHeight = SCREEN_HEIGHT;
    const translateY = useRef(new Animated.Value(adjustedScreenHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const isAnimating = useRef(false);

    const resetPosition = Animated.timing(translateY, {
        toValue: adjustedScreenHeight,
        duration: 300,
        useNativeDriver: true,
    });

    const closeSheet = Animated.parallel([
        Animated.timing(translateY, {
            toValue: adjustedScreenHeight,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }),
    ]);

    const openSheet = Animated.parallel([
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }),
    ]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(adjustedScreenHeight - height + gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    hide();
                } else {
                    resetPosition.start();
                }
            },
        })
    ).current;

    const show = useCallback(() => {
        isAnimating.current = true;
        openSheet.start(() => {
            isAnimating.current = false;
        });
    }, [height]);

    const hide = useCallback(() => {
        isAnimating.current = true;
        closeSheet.start(() => {
            isAnimating.current = false;
            onClose();
        });
    }, [height]);

    useEffect(() => {
        if (isOpen) {
            show();
        } else {
            hide();
        }
    }, [isOpen, show, hide]);

    return (
        <>
            {/* Backdrop */}
            <Animated.View
                pointerEvents={isOpen ? 'auto' : 'none'}
                style={[
                    styles.backdrop,
                    {
                        opacity: backdropOpacity,
                    },
                ]}
            >
                <TouchableWithoutFeedback onPress={hide}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
            </Animated.View>

            {/* Bottom Sheet */}
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        height: height,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <View style={styles.handlerContainer} {...panResponder.panHandlers}>
                    <View style={styles.handler} />
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 20, minHeight: height - 20 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    {children}
                </ScrollView>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 20,
        overflow: 'hidden',
    },
    handlerContainer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 4,
    },
    handler: {
        width: 50,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
    },
    scrollView: {
        flex: 1,
    },
});

export default BottomSheetComponent;