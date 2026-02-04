# Email Service - UI Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           APP ROOT (app.ts)                     │
│         - RouterOutlet for navigation           │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
    ┌───▼────┐      ┌─────▼──────┐
    │  Login │      │  Mail      │
    │  Page  │      │  Module    │ (Lazy-loaded)
    └────────┘      └─────┬──────┘
                          │
                    ┌─────▼──────────────┐
                    │                    │
                  ┌─▼──────┐        ┌───▼────────┐
                  │ Inbox  │ ◄──────┤ Auth Guard │
                  │ (Main  │        └────────────┘
                  │ Page)  │
                  └────────┘
```

## Page Flow

### 1. Login Page (`/login`)
- **Route:** `/login` (public)
- **Component:** `LoginComponent`
- **Features:**
  - Email input field with validation
  - Password input field
  - Error message display
  - Sign In button with gradient styling
  - Slide-up animation

**Visual:**
```
┌─────────────────────────────┐
│     📧 Welcome Back         │
│  Sign in to your account    │
├─────────────────────────────┤
│ Email: [____________]       │
│ Password: [____________]    │
│                             │
│ [Sign In] button            │
└─────────────────────────────┘
```

---

### 2. Inbox Page (`/mail/inbox`)
- **Route:** `/mail/inbox` (protected by AuthGuard)
- **Component:** `InboxComponent`
- **Layout:** 3-column responsive design

**Main Sections:**

#### A. Header
```
┌──────────────────────────────────────────────────┐
│  📧 Inbox  (6 emails)    | Compose | User ↓    │
└──────────────────────────────────────────────────┘
```

#### B. Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ┌────────────┐ ┌──────────────────────┐ ┌──────────────────┐│
│ │  Sidebar   │ │  Search Bar          │ │  Email Detail    ││
│ │            │ │  [🔍 Search...]     │ │  (when selected) ││
│ │ 📥 Inbox   │ │                      │ │                  ││
│ │ ⭐ Starred │ │ ┌─────────────────────┤ │  From: ...       ││
│ │ ✏️ Drafts  │ │ │ Email 1 ●          │ │  Subject: ...    ││
│ │ ✓ Sent    │ │ │ Email 2            │ │  Body: ...       ││
│ │ 🔗 All    │ │ │ Email 3            │ │                  ││
│ │           │ │ │ Email 4            │ │  [Reply]         ││
│ │ Labels:   │ │ │ Email 5            │ │  [Reply All]     ││
│ │ 🏷️ Work   │ │ │ Email 6            │ │  [Forward]       ││
│ │ 🏷️ Personal│ └─────────────────────┘ └──────────────────┘│
│ └────────────┘ │ ← Scroll for more    │                    │
│                └────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Details

### InboxComponent (`inbox.ts`)

**Signals (Reactive State):**
```typescript
emails: Email[]           // List of all emails
searchQuery: string       // Current search term
currentUser: string       // Logged-in user email
selectedEmail: Email      // Currently selected email
```

**Methods:**
```typescript
loadEmails()              // Initialize mock email data
getFilteredEmails()       // Return emails matching search
selectEmail(email)        // Select email for detail view
closeEmail()              // Deselect email
composeEmail()            // Navigate to compose page
logout()                  // Sign out and go to login
deleteEmail(email)        // Remove email from list
getInitials(name)         // Generate avatar initials
```

**Email Interface:**
```typescript
interface Email {
  id: number              // Unique identifier
  from: string            // Sender email
  subject: string         // Email subject
  preview: string         // Preview text
  date: string            // Send date/time
  isRead: boolean         // Read status
  avatar: string          // Sender initials
}
```

---

## Styling System

### Color Scheme
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Background:** `#f5f5f5`
- **White Cards:** `#ffffff`
- **Text Dark:** `#1a1a1a`
- **Text Gray:** `#555` / `#999`
- **Borders:** `#e0e0e0`

### Key Classes
```scss
.inbox-container       // Main container (flex column, 100vh)
.inbox-header         // Top header (sticky)
.sidebar              // Left navigation panel
.email-list-section   // Middle email list
.email-detail-panel   // Right detail view
.email-item           // Single email in list
  .unread             // Unread state
  .email-avatar       // Sender initials circle
```

---

## Responsive Breakpoints

| Screen Size | Layout | Visible |
|---|---|---|
| **Desktop** (1200px+) | 3-column | All sections |
| **Tablet** (768-1200px) | 2-column | Sidebar + List OR List + Detail |
| **Mobile** (<768px) | 1-column | Email list only, detail overlay |

---

## User Interactions

### Email Selection Flow
```
1. Click email item
   ↓
2. Item highlights with background color
   ↓
3. Mark as read (isRead = true)
   ↓
4. Detail panel loads on right
   ↓
5. User can read or close (X button)
```

### Search Flow
```
1. Type in search bar
   ↓
2. Filters emails by: from, subject, preview
   ↓
3. List updates in real-time
   ↓
4. Clear search = all emails shown
```

### Logout Flow
```
1. Click ↓ button in header
   ↓
2. Confirm logout (calls auth.logout())
   ↓
3. Clear localStorage tokens
   ↓
4. Navigate to /login
```

---

## Performance Optimization

- **Lazy Loading:** Mail module only loaded after login
- **OnPush Detection:** Ready for implementation
- **Virtual Scrolling:** Ready for large email lists
- **Bundle Size:** 
  - Main: ~1.85 KB gzipped
  - Mail Module: ~3.93 KB gzipped
  - Styles: ~600 bytes gzipped

---

## File Structure & Sizes

```
src/app/mail/inbox/
├── inbox.ts          (92 lines, component logic)
├── inbox.html        (153 lines, template with @if/@for)
└── inbox.scss        (5.95 kB, comprehensive styles)

Total inbox: ~6.5 KB uncompressed
```

---

## Key Features Implemented

✅ **Email List Display**
- Mock data with 6 realistic emails
- Sender avatars with initials
- Subject and preview text
- Date/time display
- Unread indicators

✅ **Search Functionality**
- Real-time filtering
- Searches: from, subject, preview
- Case-insensitive
- Empty state handling

✅ **Detail View**
- Full email content display
- Sender information
- Email date
- Action buttons (Reply, Reply All, Forward)
- Quick actions (Delete, Archive, Spam)

✅ **Navigation**
- Sidebar with folder navigation
- Folder counts
- Label system
- Active state indication

✅ **Responsive Design**
- Mobile-first approach
- Media queries for all breakpoints
- Touch-friendly buttons and spacing
- Proper text overflow handling

---

## Testing Checklist

- [ ] Login with any email/password
- [ ] View inbox with 6 emails
- [ ] Click email to see detail panel
- [ ] Search functionality works
- [ ] Click close (X) to close detail panel
- [ ] Try on mobile (resize browser)
- [ ] Click logout button
- [ ] Redirected to login page
