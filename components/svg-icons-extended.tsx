/**
 * TEXA Extended SVG Icons
 * Colorful, unique vector icons for profile, settings, and advanced features
 */

import React from "react";
import Svg, {
  Circle,
  Path,
  G,
  Rect,
  Line,
  Polyline,
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
  Polygon,
} from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Profile Icon with gradient
export function ProfileIcon({ size = 24, color = "#0a7ea4" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="8" r="4" fill="url(#profileGradient)" />
      <Path
        d="M 4 20 Q 4 14 12 14 Q 20 14 20 20"
        fill="url(#profileGradient)"
        opacity="0.8"
      />
    </Svg>
  );
}

// Settings Icon with gradient
export function SettingsIcon({ size = 24, color = "#F59E0B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="settingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#FBBF24" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="2" fill="url(#settingsGradient)" />
      <Path
        d="M 12 2 L 14 6 L 18 7 L 15 10 L 16 14 L 12 12 L 8 14 L 9 10 L 6 7 L 10 6 L 12 2 Z"
        stroke="url(#settingsGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Privacy Icon
export function PrivacyIcon({ size = 24, color = "#8B5CF6" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="privacyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#A78BFA" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 12 2 L 3 6 L 3 12 Q 3 18 12 22 Q 21 18 21 12 L 21 6 L 12 2 Z"
        stroke="url(#privacyGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="2" fill="url(#privacyGradient)" />
    </Svg>
  );
}

// Security Icon
export function SecurityIcon({ size = 24, color = "#EF4444" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#F87171" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 12 2 L 4 5 L 4 11 Q 4 17 12 21 Q 20 17 20 11 L 20 5 L 12 2 Z"
        fill="url(#securityGradient)"
        opacity="0.2"
        stroke="url(#securityGradient)"
        strokeWidth="1.5"
      />
      <Path
        d="M 10 14 L 12 16 L 16 10"
        stroke="url(#securityGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Notification Icon
export function NotificationIcon({ size = 24, color = "#06B6D4" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="notificationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#22D3EE" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 5 10 L 5 14 Q 5 18 12 20 Q 19 18 19 14 L 19 10 Q 12 6 5 10 Z"
        fill="url(#notificationGradient)"
        opacity="0.2"
        stroke="url(#notificationGradient)"
        strokeWidth="1.5"
      />
      <Circle cx="18" cy="6" r="3" fill="url(#notificationGradient)" />
    </Svg>
  );
}

// Theme Icon
export function ThemeIcon({ size = 24, color = "#EC4899" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#F472B6" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle cx="12" cy="12" r="10" fill="url(#themeGradient)" opacity="0.2" />
      <Path
        d="M 12 2 L 12 22 M 2 12 L 22 12"
        stroke="url(#themeGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="12" r="3" fill="url(#themeGradient)" />
    </Svg>
  );
}

// Edit Icon
export function EditIcon({ size = 24, color = "#3B82F6" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="editGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 3 17 L 3 21 L 7 21 L 19 9 L 15 5 L 3 17 Z"
        fill="url(#editGradient)"
        opacity="0.2"
        stroke="url(#editGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 15 5 L 19 9"
        stroke="url(#editGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Gallery Icon
export function GalleryIcon({ size = 24, color = "#10B981" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="galleryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#34D399" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="2"
        y="3"
        width="20"
        height="18"
        rx="2"
        fill="url(#galleryGradient)"
        opacity="0.1"
        stroke="url(#galleryGradient)"
        strokeWidth="1.5"
      />
      <Circle cx="7" cy="8" r="1.5" fill="url(#galleryGradient)" />
      <Path
        d="M 2 14 L 8 8 L 14 14 L 22 6"
        stroke="url(#galleryGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Camera Icon
export function CameraIconExtended({ size = 24, color = "#F97316" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#FB923C" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2"
        fill="url(#cameraGradient)"
        opacity="0.1"
        stroke="url(#cameraGradient)"
        strokeWidth="1.5"
      />
      <Circle cx="12" cy="13" r="3" fill="none" stroke="url(#cameraGradient)" strokeWidth="1.5" />
      <Circle cx="18" cy="8" r="1" fill="url(#cameraGradient)" />
    </Svg>
  );
}

// Microphone Icon
export function MicrophoneIconExtended({ size = 24, color = "#06B6D4" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#22D3EE" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="8"
        y="2"
        width="8"
        height="10"
        rx="4"
        fill="url(#micGradient)"
        opacity="0.2"
        stroke="url(#micGradient)"
        strokeWidth="1.5"
      />
      <Path
        d="M 6 12 Q 6 15 12 17 Q 18 15 18 12"
        stroke="url(#micGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Line x1="12" y1="17" x2="12" y2="22" stroke="url(#micGradient)" strokeWidth="1.5" />
    </Svg>
  );
}

// Logout Icon
export function LogoutIcon({ size = 24, color = "#EF4444" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="logoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#F87171" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 3 12 L 13 12"
        stroke="url(#logoutGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 10 9 L 13 12 L 10 15"
        stroke="url(#logoutGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 13 3 L 20 3 Q 21 3 21 4 L 21 20 Q 21 21 20 21 L 13 21"
        stroke="url(#logoutGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Help Icon
export function HelpIcon({ size = 24, color = "#6366F1" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="helpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#helpGradient)"
        opacity="0.1"
        stroke="url(#helpGradient)"
        strokeWidth="1.5"
      />
      <Path
        d="M 10 9 Q 10 7 12 7 Q 14 7 14 9 Q 14 10 13 11 L 13 13"
        stroke="url(#helpGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="17" r="1" fill="url(#helpGradient)" />
    </Svg>
  );
}

// About Icon
export function AboutIcon({ size = 24, color = "#14B8A6" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="aboutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#2DD4BF" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#aboutGradient)"
        opacity="0.1"
        stroke="url(#aboutGradient)"
        strokeWidth="1.5"
      />
      <Circle cx="12" cy="8" r="1" fill="url(#aboutGradient)" />
      <Path
        d="M 11 11 L 11 17 M 13 11 L 13 17"
        stroke="url(#aboutGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Encryption Icon
export function EncryptionIcon({ size = 24, color = "#22C55E" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="encryptionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#4ADE80" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="5"
        y="12"
        width="14"
        height="9"
        rx="1"
        fill="url(#encryptionGradient)"
        opacity="0.1"
        stroke="url(#encryptionGradient)"
        strokeWidth="1.5"
      />
      <Path
        d="M 7 12 L 7 8 Q 7 5 12 5 Q 17 5 17 8 L 17 12"
        stroke="url(#encryptionGradient)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="16" r="1.5" fill="url(#encryptionGradient)" />
    </Svg>
  );
}

// Biometric Icon
export function BiometricIcon({ size = 24, color = "#8B5CF6" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="biometricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#A78BFA" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        fill="url(#biometricGradient)"
        opacity="0.1"
        stroke="url(#biometricGradient)"
        strokeWidth="1.5"
      />
      <Circle cx="12" cy="12" r="3" fill="none" stroke="url(#biometricGradient)" strokeWidth="1.5" />
      <Circle cx="12" cy="12" r="5" fill="none" stroke="url(#biometricGradient)" strokeWidth="1" />
    </Svg>
  );
}

// Data Icon
export function DataIcon({ size = 24, color = "#F59E0B" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#FBBF24" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect x="3" y="5" width="3" height="14" rx="1" fill="url(#dataGradient)" opacity="0.8" />
      <Rect x="9" y="3" width="3" height="16" rx="1" fill="url(#dataGradient)" opacity="0.6" />
      <Rect x="15" y="7" width="3" height="12" rx="1" fill="url(#dataGradient)" opacity="0.4" />
    </Svg>
  );
}

// Export all icons
export const ExtendedIcons = {
  ProfileIcon,
  SettingsIcon,
  PrivacyIcon,
  SecurityIcon,
  NotificationIcon,
  ThemeIcon,
  EditIcon,
  GalleryIcon,
  CameraIconExtended,
  MicrophoneIconExtended,
  LogoutIcon,
  HelpIcon,
  AboutIcon,
  EncryptionIcon,
  BiometricIcon,
  DataIcon,
};
