# TEXA Design System & Architecture

**App Name:** TEXA - Connect Beyond Limits  
**Platform:** Android-first (React Native with Expo)  
**Theme:** Premium luxury with minimal futuristic design  
**Target Orientation:** Portrait (9:16)

---

## Design System

### Color Palette

| Color | Light | Dark | Usage |
|-------|-------|------|-------|
| **Primary** | `#F4D03F` (Golden) | `#F4D03F` | Accent, CTAs, highlights |
| **Background** | `#FFFFFF` | `#0F0F0F` | Screen backgrounds |
| **Surface** | `#F8F9FA` | `#1A1A1A` | Cards, elevated surfaces |
| **Foreground** | `#1A1A1A` | `#FFFFFF` | Primary text |
| **Muted** | `#6B7280` | `#9CA3AF` | Secondary text |
| **Border** | `#E5E7EB` | `#2D2D2D` | Dividers, borders |
| **Success** | `#10B981` | `#34D399` | Success states |
| **Warning** | `#F59E0B` | `#FBBF24` | Warnings |
| **Error** | `#EF4444` | `#F87171` | Errors, destructive |

### Typography

- **Display (Hero):** 32px, weight 700, line-height 1.2
- **Heading 1:** 28px, weight 600, line-height 1.3
- **Heading 2:** 24px, weight 600, line-height 1.3
- **Heading 3:** 20px, weight 600, line-height 1.4
- **Body Large:** 16px, weight 400, line-height 1.5
- **Body Regular:** 14px, weight 400, line-height 1.5
- **Body Small:** 12px, weight 400, line-height 1.4
- **Caption:** 11px, weight 500, line-height 1.4

### Visual Effects

- **Glassmorphism:** 10% opacity blur, 0.8 opacity background
- **Shadows:** Subtle (0 2px 8px rgba(0,0,0,0.08)) to elevated (0 12px 24px rgba(0,0,0,0.12))
- **Border Radius:** 12px (standard), 16px (large), 24px (extra large), 50% (pills)
- **Gradients:** Soft linear gradients (golden to transparent, white to surface)
- **Animations:** 200-300ms duration, ease-out timing

---

## Screen Architecture

### Authentication Flow

1. **Splash Screen**
   - TEXA logo centered
   - Tagline: "Connect Beyond Limits"
   - Auto-navigate to Login/Home based on auth state
   - Duration: 2s

2. **Login Screen**
   - Phone number input with country selector
   - "Send OTP" button
   - "Don't have account? Sign up" link
   - Social login options (optional)

3. **OTP Verification Screen**
   - 6-digit OTP input
   - Timer with resend option
   - "Back" button to change phone

4. **Username Setup Screen**
   - Username input with availability check
   - Profile photo upload
   - Bio/status input
   - "Continue" button

5. **Biometric Setup Screen**
   - Enable Face ID / Fingerprint toggle
   - "Skip" and "Enable" buttons
   - Explanation of security benefits

### Main App Screens (Tab Bar Navigation)

#### Tab 1: Chats (Home)
- **Content:**
  - Search bar at top
  - Chat list with:
    - Avatar (circular)
    - Name/group name
    - Last message preview
    - Timestamp
    - Unread badge
    - Mute indicator
  - Floating action button (+ for new chat)
  - Swipe actions: archive, mute, delete

- **Features:**
  - Pull-to-refresh
  - Pagination for large lists
  - Search across chats
  - Chat folders/categories
  - Pinned chats section

#### Tab 2: Calls
- **Content:**
  - Recent calls list with:
    - Contact avatar
    - Name
    - Call type (voice/video)
    - Duration
    - Timestamp
    - Call status (missed, incoming, outgoing)
  - Favorites section
  - Floating action button (+ for new call)

- **Features:**
  - Call history
  - Missed call notifications
  - Quick call from contacts

#### Tab 3: Status/Stories
- **Content:**
  - Your status at top (add new)
  - Friends' statuses in grid:
    - Avatar with ring indicator (viewed/unviewed)
    - Name
    - Timestamp
  - Floating action button (+ for new status)

- **Features:**
  - 24-hour auto-delete
  - Privacy controls (who can see)
  - View count
  - Story reactions

#### Tab 4: Contacts
- **Content:**
  - Search bar
  - Contacts list with:
    - Avatar
    - Name
    - Status/online indicator
    - Quick call/message buttons
  - Floating action button (+ add contact)

- **Features:**
  - QR code add friend
  - Nearby users (optional)
  - Blocked contacts
  - Favorite contacts

#### Tab 5: Profile/Settings
- **Content:**
  - Profile header:
    - Large avatar
    - Name
    - Username
    - Bio/status
    - Edit button
  - Settings sections:
    - Account
    - Privacy
    - Notifications
    - Security
    - About

### Chat Conversation Screen

- **Header:**
  - Back button
  - Contact/group name
  - Online status / last seen
  - Call buttons (voice/video)
  - Menu (info, mute, archive, block)

- **Message List:**
  - Messages grouped by date
  - Sender avatar (left) / own avatar (right)
  - Message bubble with:
    - Text content
    - Timestamp
    - Read receipts (checkmarks)
    - Reaction emojis
  - Swipe to reply
  - Long-press for actions (react, reply, forward, delete, pin)

- **Input Area:**
  - Text input field
  - Attachment button (camera, gallery, file, location)
  - Emoji picker
  - Send button
  - Typing indicator when composing

- **Features:**
  - Disappearing messages timer
  - Pinned messages section
  - Search in chat
  - Message reactions
  - Threaded replies

### Group/Community Screens

- **Group Info:**
  - Group avatar
  - Group name
  - Description
  - Member count
  - Admin/moderator badges
  - Member list with roles
  - Leave/delete group button

- **Group Settings:**
  - Notification settings
  - Mute duration
  - Hide notifications
  - Custom sound

- **Admin Dashboard:**
  - Member management
  - Role assignment
  - Moderation tools
  - Announcement posting

### Media Viewer

- **Image Viewer:**
  - Full-screen image
  - Pinch-to-zoom
  - Swipe to navigate
  - Download button
  - Share button
  - Delete button

- **Video Viewer:**
  - Full-screen video player
  - Play/pause controls
  - Progress bar
  - Volume control
  - Download button

### Search Screen

- **Search Bar:**
  - Global search across messages, contacts, groups
  - Filter options (messages, people, groups)
  - Recent searches

- **Results:**
  - Grouped by type
  - Highlighted search terms
  - Quick actions (open chat, call, etc.)

### Settings Screens

1. **Account Settings**
   - Phone number
   - Username
   - Email (optional)
   - Change password

2. **Privacy Settings**
   - Hide online status
   - Hide read receipts
   - Hide profile photo
   - Block list
   - Last seen visibility

3. **Notification Settings**
   - Push notifications toggle
   - Sound selection
   - Vibration toggle
   - LED color
   - Notification preview (full/name only/hidden)

4. **Security Settings**
   - Biometric lock
   - Passcode lock
   - Two-factor authentication
   - Device sessions
   - Login alerts
   - Trusted devices

5. **About**
   - App version
   - Privacy policy
   - Terms of service
   - Feedback
   - Rate app

---

## User Flows

### New Chat Flow
1. User taps "+" button on Chats tab
2. Select contact from list or search
3. Chat conversation screen opens
4. User can type and send message

### Group Creation Flow
1. User taps "+" button on Chats tab
2. Select "Create Group"
3. Add group name, description, avatar
4. Select members
5. Set group privacy (public/private)
6. Create group

### Voice Call Flow
1. User initiates call (from chat or contacts)
2. Ringing screen shows caller info
3. Recipient can accept/decline
4. Call screen with:
   - Mute/speaker/end buttons
   - Floating contact info
   - Keypad (optional)
5. Call ends, shows duration

### Video Call Flow
1. Similar to voice call
2. Call screen shows:
   - Own video (small, bottom-right)
   - Recipient video (full-screen)
   - Mute/camera/speaker/end buttons
   - Screen share button (optional)

### Status/Story Creation Flow
1. User taps "+" on Status tab
2. Choose media type (text/image/video/audio)
3. Edit with text, stickers, effects
4. Set privacy (everyone/contacts/custom)
5. Post status

---

## Interaction Patterns

### Gestures
- **Swipe left:** Archive/delete (on chat list)
- **Swipe right:** Mark as read (on chat list)
- **Long-press:** Context menu (messages, chats)
- **Pinch:** Zoom (media viewer)
- **Double-tap:** Like/react (messages)

### Feedback
- **Button press:** Scale 0.97, haptic light
- **List item:** Opacity 0.7
- **Toggle:** Haptic medium
- **Success:** Haptic notification + toast
- **Error:** Haptic error + toast

### Loading States
- Skeleton screens for lists
- Spinner for operations
- Progress bar for uploads/downloads

---

## Performance Considerations

- **Lazy loading:** Messages, media, contacts
- **Pagination:** 20 items per page
- **Caching:** Recent chats, contacts, media
- **Offline support:** Draft messages, read receipts queuing
- **Battery optimization:** Background sync intervals, media compression
- **Memory:** Limit in-memory message cache to 500 recent messages

---

## Accessibility

- Minimum touch target: 44x44 points
- Color contrast: WCAG AA (4.5:1 for text)
- Screen reader support for all interactive elements
- Haptic feedback for important actions
- Text scaling support (up to 200%)

---

## Security UI Indicators

- **End-to-end encryption:** Lock icon on chats
- **Verified contact:** Checkmark badge
- **Secure connection:** Shield icon in header
- **Disappearing messages:** Timer icon
- **Secret chat:** Incognito badge

