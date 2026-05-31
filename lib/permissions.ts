/**
 * TEXA Device Permissions Service
 * Handles camera, gallery, contacts, microphone, and notification permissions
 */

import * as ImagePicker from "expo-image-picker";
import * as Contacts from "expo-contacts";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

export interface PermissionResult {
  granted: boolean;
  status: string;
  message: string;
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<PermissionResult> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      return {
        granted: true,
        status: "granted",
        message: "Camera permission granted",
      };
    }

    return {
      granted: false,
      status,
      message: "Camera permission denied",
    };
  } catch (error) {
    return {
      granted: false,
      status: "error",
      message: `Error requesting camera permission: ${error}`,
    };
  }
}

/**
 * Request gallery/media library permission
 */
export async function requestGalleryPermission(): Promise<PermissionResult> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      return {
        granted: true,
        status: "granted",
        message: "Gallery permission granted",
      };
    }

    return {
      granted: false,
      status,
      message: "Gallery permission denied",
    };
  } catch (error) {
    return {
      granted: false,
      status: "error",
      message: `Error requesting gallery permission: ${error}`,
    };
  }
}

/**
 * Request contacts permission
 */
export async function requestContactsPermission(): Promise<PermissionResult> {
  try {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === "granted") {
      return {
        granted: true,
        status: "granted",
        message: "Contacts permission granted",
      };
    }

    return {
      granted: false,
      status,
      message: "Contacts permission denied",
    };
  } catch (error) {
    return {
      granted: false,
      status: "error",
      message: `Error requesting contacts permission: ${error}`,
    };
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<PermissionResult> {
  try {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    if (status === "granted") {
      return {
        granted: true,
        status: "granted",
        message: "Notification permission granted",
      };
    }

    return {
      granted: false,
      status,
      message: "Notification permission denied",
    };
  } catch (error) {
    return {
      granted: false,
      status: "error",
      message: `Error requesting notification permission: ${error}`,
    };
  }
}

/**
 * Pick image from gallery
 */
export async function pickImageFromGallery() {
  try {
    const permission = await requestGalleryPermission();

    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        "Gallery permission is required to select images"
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    Alert.alert("Error", `Failed to pick image: ${error}`);
    return null;
  }
}

/**
 * Take photo with camera
 */
export async function takePhotoWithCamera() {
  try {
    const permission = await requestCameraPermission();

    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        "Camera permission is required to take photos"
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    Alert.alert("Error", `Failed to take photo: ${error}`);
    return null;
  }
}

/**
 * Get all contacts
 */
export async function getAllContacts() {
  try {
    const permission = await requestContactsPermission();

    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        "Contacts permission is required to access your contacts"
      );
      return [];
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Emails,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Image,
      ],
    });

    return data;
  } catch (error) {
    Alert.alert("Error", `Failed to get contacts: ${error}`);
    return [];
  }
}

/**
 * Search contacts by name
 */
export async function searchContacts(query: string) {
  try {
    const allContacts = await getAllContacts();

    if (!query.trim()) {
      return allContacts;
    }

    return allContacts.filter((contact: any) =>
      contact.name?.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    Alert.alert("Error", `Failed to search contacts: ${error}`);
    return [];
  }
}

/**
 * Schedule local notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  delaySeconds: number = 0
) {
  try {
    const permission = await requestNotificationPermission();

    if (!permission.granted) {
      console.warn("Notification permission not granted");
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
        badge: 1,
      },
      trigger: delaySeconds > 0 ? ({ seconds: delaySeconds } as any) : null,
    });

    return notificationId;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

/**
 * Send immediate notification
 */
export async function sendNotification(title: string, body: string) {
  return scheduleNotification(title, body, 0);
}

/**
 * Cancel notification
 */
export async function cancelNotification(notificationId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}

/**
 * Set up notification handlers
 */
export function setupNotificationHandlers() {
  // Handle notification when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Handle notification taps
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      console.log("Notification tapped:", response.notification);
      // Handle navigation or other actions
    }
  );

  return subscription;
}

/**
 * Request all critical permissions
 */
export async function requestAllPermissions() {
  const results = {
    camera: await requestCameraPermission(),
    gallery: await requestGalleryPermission(),
    contacts: await requestContactsPermission(),
    notifications: await requestNotificationPermission(),
  };

  return results;
}

/**
 * Check if all critical permissions are granted
 */
export async function checkAllPermissions() {
  const results = await requestAllPermissions();

  const allGranted = Object.values(results).every((r) => r.granted);

  return {
    allGranted,
    results,
  };
}
