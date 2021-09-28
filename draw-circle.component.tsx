import React from "react";
import { Dimensions, Platform, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, useAnimatedProps, useDerivedValue } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { ReText } from "react-native-redash";
import { DrawCircleComponentStyle } from "./draw-circle.style";
import { theme } from "../../../App.style";
import { Button, Card, List } from "react-native-paper";

interface DrawCircleComponentParams {
    longitudeDelta: any,
    mapCallback: any
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DrawCircleComponent = (props: DrawCircleComponentParams) => {

    //tính khoảng cách (m) trên mỗi đơn vị màn hình
    const widthScreen = Dimensions.get("window").width
    const distance = (props.longitudeDelta * 111000) / widthScreen

    const circleX = useSharedValue(0); // Tọa độ X
    const circleY = useSharedValue(0); // Tọa độ Y
    const circleR = useSharedValue(0); // Bán kính

    const panHandler = useAnimatedGestureHandler({ //Sự kiện Drag trên màn hình
        onStart: (evt) => {
            circleR.value = 0 //reset bán kính
            circleX.value = evt.x
            circleY.value = evt.y
        },
        onActive: (evt) => {
            const x = evt.translationX
            const y = evt.translationY
            circleR.value = Math.sqrt(x * x + y * y)
        },
        onEnd: (evt) => console.log("onEnd", evt.x, evt.y),
    })

    const animatedCircleProps = useAnimatedProps(() => { // Đường tròn
        return {
            cx: circleX.value,
            cy: circleY.value,
            r: circleR.value,
        };
    }, []);
    const animatedCircleCenterProps = useAnimatedProps(() => { // Tâm đường tròn
        return {
            cx: circleX.value,
            cy: circleY.value,
            r: 3,
            opacity: circleR.value > 0 ? 1 : 0,
        };
    }, []);
    const animatedCircleRightProps = useAnimatedProps(() => { // Chấm trên viền đường tròn
        return {
            cx: circleX.value + circleR.value,
            cy: circleY.value,
            r: 3,
            opacity: circleR.value > 0 ? 1 : 0,
        };
    }, []);

    const animatedComponentStyle = useAnimatedStyle(() => { // Hiển thị Text khoảng cách
        return {
            left: circleX.value,
            top: circleY.value,
            width: circleR.value,
            opacity: circleR.value > 20 ? 1 : 0,
        };
    }, []);

    const distanceStr = useDerivedValue(() => { // Tính khoảng cách đơn vị m
        const getDistance = circleR.value * distance
        return getDistance.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " m"
    });

    return (
        <>
            <Svg style={
                DrawCircleComponentStyle.svg
            }>
                <AnimatedCircle // Đường tròn dynamic
                    animatedProps={animatedCircleProps}
                    strokeWidth={2}
                    stroke={theme.colors.primary}
                    fill={theme.colors.primary}
                    fillOpacity={0.1}
                />
                <AnimatedCircle // Tâm đường tròn
                    animatedProps={animatedCircleCenterProps}
                    strokeWidth={2}
                    stroke={theme.colors.primary}
                    fill={theme.colors.primary}
                />
                <AnimatedCircle // Chấm trên viền đường tròn
                    animatedProps={animatedCircleRightProps}
                    strokeWidth={2}
                    stroke={theme.colors.primary}
                    fill={theme.colors.primary}
                />
            </Svg>

            
            <PanGestureHandler
                onGestureEvent={panHandler} //bắt sự kiện drag on screen
                maxPointers={1} >
                <Animated.View style={{flex:1}}>
                </Animated.View>
            </PanGestureHandler>

            <Animated.View style={[
                DrawCircleComponentStyle.distanceContainer,
                animatedComponentStyle]}
            >
                <View style={DrawCircleComponentStyle.distancePanel}>
                    <ReText
                        text={distanceStr} //hiển thị bán kính (m) khi vẽ đường tròn
                        style={DrawCircleComponentStyle.distanceLabel} />
                </View>
                <Button onPress={props.mapCallback}></Button>
            </Animated.View>
        </>
    )
}

export default DrawCircleComponent