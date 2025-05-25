import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
    dotColor?: string;
    dotSize?: number;
    animationDuration?: number;
};

const DotBouncingComponent: React.FC<Props> = ({
    dotColor = "#6200EE",
    dotSize = 8,
    animationDuration = 300,
}) => {
    const dotCount = 3;

    const animations = useRef(
        [...Array(dotCount)].map(() => ({
            translateY: new Animated.Value(0),
            opacity: new Animated.Value(0.3),
        }))
    ).current;

    useEffect(() => {
        const loop = () => {
            const sequences = animations.map((anim, i) =>
                Animated.sequence([
                    Animated.delay(i * animationDuration),
                    Animated.parallel([
                        Animated.timing(anim.translateY, {
                            toValue: -4, /** Nhảy lên nhẹ **/
                            duration: animationDuration,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim.opacity, {
                            toValue: 1,
                            duration: animationDuration,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(anim.translateY, {
                            toValue: 0,
                            duration: animationDuration,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim.opacity, {
                            toValue: 0.3,
                            duration: animationDuration,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            );

            Animated.sequence([
                Animated.parallel(sequences),
                Animated.delay(animationDuration * 2), // delay sau khi hoàn tất một vòng
            ]).start(() => loop());
        };

        loop();
    }, [animations]);

    return (
        <View style={styles.container}>
            {animations.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            width: dotSize,
                            height: dotSize,
                            backgroundColor: dotColor,
                            marginHorizontal: dotSize / 2,
                            borderRadius: dotSize / 2,
                            opacity: anim.opacity,
                            transform: [{ translateY: anim.translateY }],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    dot: {

    },
});

export default DotBouncingComponent;
