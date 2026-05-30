/**
 * TEXA Splash Screen
 * Beautiful animated onboarding with logo animation
 */

import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TexaLogo } from "@/components/svg-icons";
import { useColors } from "@/hooks/use-colors";

export default function SplashScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Logo scale and fade in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Text slide in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Hold for 1.5 seconds
      Animated.delay(1500),
    ]).start(() => {
      // Navigate to auth after animation
      router.replace("/auth/login");
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Animated Background Gradient */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background,
        }}
      />

      {/* Logo Container */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          marginBottom: 40,
        }}
      >
        <TexaLogo size={120} color={colors.primary} />
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: colors.foreground,
            letterSpacing: -0.5,
            marginBottom: 8,
          }}
        >
          TEXA
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.muted,
            textAlign: "center",
            letterSpacing: 1,
            fontWeight: "500",
          }}
        >
          CONNECT BEYOND LIMITS
        </Text>
      </Animated.View>

      {/* Bottom Loading Indicator */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          flexDirection: "row",
          gap: 8,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.primary,
              opacity: opacityAnim,
              transform: [
                {
                  scale: opacityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            }}
          />
        ))}
      </View>
    </View>
  );
}
