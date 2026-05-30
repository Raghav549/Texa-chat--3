/**
 * TEXA Custom SVG Icons
 * Beautiful, animated vector icons for the entire app
 */

import React from "react";
import { View, Pressable } from "react-native";
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
} from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  animated?: boolean;
}

// TEXA Logo - Main brand icon
export function TexaLogo({ size = 64, color = "#0a7ea4" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id="texaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Circle cx="32" cy="32" r="30" fill="url(#texaGradient)" opacity="0.1" />
      <Path
        d="M 20 32 Q 32 20 44 32 Q 32 44 20 32"
        fill="url(#texaGradient)"
        strokeWidth="2"
        stroke={color}
      />
      <Circle cx="32" cy="32" r="6" fill={color} />
    </Svg>
  );
}

// Message Icon
export function MessageIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 8 L 3 18 Q 3 20 5 20 L 19 20 Q 21 20 21 18 L 21 8 Q 21 6 19 6 L 5 6 Q 3 6 3 8 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 3 8 L 12 14 L 21 8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Phone Call Icon
export function CallIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 6 Q 3 4 5 4 L 9 4 Q 10 4 10.5 5 L 13 11 Q 13.3 11.7 12.8 12.2 Q 11 14 11 14 Q 13 17 16 19 Q 16 19 18 17.2 Q 18.5 16.7 19.2 17 L 25 19.5 Q 26 20 26 21 L 26 21 Q 26 23 24 23 L 20 23 Q 10 23 3 16 Q 3 6 3 6 Z"
        fill={color}
        opacity="0.8"
      />
    </Svg>
  );
}

// Video Call Icon
export function VideoCallIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="4"
        width="14"
        height="10"
        rx="1"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M 16 7 L 22 3 L 22 15 L 16 11"
        fill={color}
        opacity="0.8"
      />
    </Svg>
  );
}

// Camera Icon
export function CameraIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M 2 8 L 6 4 L 18 4 L 22 8 L 22 18 Q 22 20 20 20 L 4 20 Q 2 20 2 18 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Gallery Icon
export function GalleryIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="2"
        y="3"
        width="20"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <Circle cx="7" cy="8" r="1.5" fill={color} />
      <Path
        d="M 2 18 L 8 10 L 14 16 L 22 8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Contacts Icon
export function ContactsIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M 4 20 Q 4 15 12 15 Q 20 15 20 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </Svg>
  );
}

// Settings Icon
export function SettingsIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M 12 2 L 14.5 7 L 20 7.5 L 16 11.5 L 17 17.5 L 12 14.5 L 7 17.5 L 8 11.5 L 4 7.5 L 9.5 7 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Story/Status Icon
export function StoryIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

// Plus/Add Icon
export function PlusIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2" />
      <Line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// Send Icon
export function SendIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 2 12 L 22 2 L 12 22 L 10 14 L 2 12 Z"
        fill={color}
        opacity="0.8"
      />
    </Svg>
  );
}

// Attachment Icon
export function AttachmentIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 5 12 L 5 19 Q 5 21 7 21 L 17 21 Q 19 21 19 19 L 19 12"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Line x1="12" y1="2" x2="12" y2="14" stroke={color} strokeWidth="1.5" />
      <Polyline
        points="8,10 12,14 16,10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Microphone Icon
export function MicrophoneIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 2 Q 14 2 14 4 L 14 11 Q 14 13 12 13 Q 10 13 10 11 L 10 4 Q 10 2 12 2 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 7 11 Q 7 15 12 15 Q 17 15 17 11"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Line x1="12" y1="15" x2="12" y2="22" stroke={color} strokeWidth="1.5" />
      <Line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

// Check Icon
export function CheckIcon({ size = 24, color = "#22C55E" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="2,12 8,18 22,4"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Double Check Icon (Seen)
export function DoubleCheckIcon({ size = 24, color = "#0a7ea4" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="2,12 8,18 15,11"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Polyline
        points="9,12 15,18 22,11"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Lock Icon
export function LockIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="4"
        y="10"
        width="16"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M 7 10 L 7 6 Q 7 3 10 3 L 14 3 Q 17 3 17 6 L 17 10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16" r="1.5" fill={color} />
    </Svg>
  );
}

// Shield Icon (Security)
export function ShieldIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 2 L 3 6 L 3 12 Q 3 18 12 22 Q 21 18 21 12 L 21 6 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

// Back Arrow Icon
export function BackIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="15,18 6,12 15,6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Menu Icon
export function MenuIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" />
      <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// Close Icon
export function CloseIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="4" x2="4" y2="20" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

// Search Icon
export function SearchIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="10" r="6" stroke={color} strokeWidth="1.5" fill="none" />
      <Line x1="14" y1="14" x2="20" y2="20" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

// Edit Icon
export function EditIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 17.25 L 3 21 L 6.75 21 L 17.81 9.94 L 14.06 6.19 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="18.91" y1="2.84" x2="21.16" y2="5.09" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

// Delete Icon
export function DeleteIcon({ size = 24, color = "#EF4444" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 6 L 5 6 L 8 3 L 16 3 L 19 6 L 21 6 L 19 20 Q 19 21 18 21 L 6 21 Q 5 21 5 20 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="10" y1="9" x2="10" y2="17" stroke={color} strokeWidth="1.5" />
      <Line x1="14" y1="9" x2="14" y2="17" stroke={color} strokeWidth="1.5" />
    </Svg>
  );
}

// User Icon
export function UserIcon({ size = 24, color = "#11181C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" fill="none" />
      <Path
        d="M 4 20 Q 4 14 12 14 Q 20 14 20 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Icon Button Component
export function IconButton({
  icon: Icon,
  onPress,
  size = 24,
  color,
  disabled = false,
}: {
  icon: React.ComponentType<IconProps>;
  onPress?: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          padding: 8,
          borderRadius: 8,
          opacity: pressed ? 0.7 : disabled ? 0.5 : 1,
        },
      ]}
    >
      <Icon size={size} color={color} />
    </Pressable>
  );
}
