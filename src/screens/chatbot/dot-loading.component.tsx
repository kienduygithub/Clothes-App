import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type Props = {
    dotColor?: string;
    dotSize?: number;
    animationDuration?: number;
}

const DotLoadingComponent: React.FC<Props> = ({
    dotColor = '#444',
    dotSize = 8,
    animationDuration = 300
}) => {
    const dotCount = 3;
    const opacities = useRef(
        [...Array(dotCount)].map(() => new Animated.Value(0.3))
    ).current;

    useEffect(() => {
        const animations = opacities.map((opacity, index) =>
            Animated.sequence([
                Animated.delay(animationDuration * index),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ])
        );

        const reset = Animated.parallel(
            opacities.map((opacity) =>
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: animationDuration / 2,
                    useNativeDriver: true,
                })
            )
        );

        const fullSequence = Animated.sequence([
            Animated.parallel(animations),
            Animated.delay(animationDuration),
            reset,
            Animated.delay(animationDuration),
        ]);

        Animated.loop(fullSequence).start();
    }, [animationDuration, opacities]);
    return (
        <View style={styles.container}>
            {opacities.map((opacity, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            backgroundColor: dotColor,
                            width: dotSize,
                            height: dotSize,
                            borderRadius: dotSize / 2,
                            opacity,
                        },
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    dot: {
        // Base styles are overridden by props
    },
})

export default DotLoadingComponent;