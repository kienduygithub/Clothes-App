import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
    dotColor?: string;
    dotSize?: number;
    animationDuration?: number;
};

const DotLoadingComponent: React.FC<Props> = ({
    dotColor = "#444",
    dotSize = 8,
    animationDuration = 300,
}) => {
    const dotCount = 3;

    const animations = useRef(
        [...Array(dotCount)].map(() => ({
            opacity: new Animated.Value(0.3),
            translateY: new Animated.Value(0),
        }))
    ).current;

    useEffect(() => {
        const dotAnimations = animations.map((anim, index) =>
            Animated.sequence([
                Animated.delay(index * animationDuration),
                Animated.parallel([
                    Animated.timing(anim.opacity, {
                        toValue: 1,
                        duration: animationDuration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.translateY, {
                        toValue: -4,
                        duration: animationDuration,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(anim.opacity, {
                        toValue: 0.3,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim.translateY, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        );

        const loop = Animated.loop(Animated.sequence([
            Animated.stagger(animationDuration, dotAnimations),
            Animated.delay(300), // Delay giữa các chu kỳ
        ]));

        loop.start();

        return () => loop.stop(); // cleanup on unmount
    }, [animationDuration]);

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
                            opacity: anim.opacity,
                            transform: [{ translateY: anim.translateY }],
                            borderRadius: dotSize / 2,
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
        gap: 5
    },
    dot: {
        backgroundColor: "#444",
    },
});

export default DotLoadingComponent;
