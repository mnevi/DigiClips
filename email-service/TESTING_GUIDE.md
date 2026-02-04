# Testing & Deployment Guide

## Quick Start

### 1. Start Development Server
```bash
cd /home/mnevi/Projects/DigiClips/email-service
npm start
```

Server runs at: `http://localhost:4200` (or 4201 if port taken)

### 2. Login
**Any of these credentials work:**
- Email: `john@example.com` / Password: `any`
- Email: `user@test.com` / Password: `password`
- Email: `admin@app.io` / Password: `123456`

All that matters is both fields have values.

### 3. Explore the Inbox
- View 6 mock emails
- Click emails to see details
- Use search to filter
- Click logout to exit

---

## Feature Testing

### Test 1: Authentication
**Steps:**
1. Go to `http://localhost:4200`
2. Try login with empty fields → Should show error or prevent submission
3. Try with email + password → Should navigate to inbox
4. Refresh page → Should stay in inbox (token persisted)

**Expected:**
- ✅ Login validates input
- ✅ Successful login redirects to `/mail/inbox`
- ✅ Session persists on refresh
- ✅ Without token, redirected to login

---

### Test 2: Inbox Display
**Steps:**
1. After login, view the inbox
2. Verify you see:
   - Header with user name and compose button
   - Sidebar with folders and labels
   - Email list with 6 emails
   - Search bar

**Expected:**
- ✅ 6 emails displayed with sender, subject, preview, date
- ✅ Unread indicators on first email
- ✅ User name shown in header
- ✅ All navigation folders visible

---

### Test 3: Email Selection
**Steps:**
1. Click on the first email
2. Detail panel appears on right
3. Verify details:
   - Sender avatar
   - Sender email
   - Send date
   - Full subject
   - Email body
   - Action buttons
4. Click X to close detail
5. Detail panel disappears

**Expected:**
- ✅ Clicking email selects it
- ✅ Detail panel slides in from right
- ✅ Email marked as read (blue indicator gone)
- ✅ Close button works
- ✅ Email body has full content

---

### Test 4: Search Functionality
**Steps:**
1. Type "Project" in search bar
2. Verify only emails with "Project" appear
3. Try "John" → Should find john@example.com emails
4. Try "Meeting" → Should find related emails
5. Clear search → All emails reappear

**Expected:**
- ✅ Search filters in real-time
- ✅ Works on: from, subject, preview
- ✅ Case-insensitive
- ✅ Clearing search shows all emails
- ✅ Empty results show "No emails found"

---

### Test 5: Responsive Design
**Desktop (1200px+):**
- 3-column layout visible
- Sidebar, email list, detail panel all shown

**Tablet (768-1200px):**
- 2-column or stacked view
- Sidebar may hide or collapse
- Email list and detail alternate

**Mobile (<768px):**
- Single column
- Email list primary view
- Detail panel as overlay/modal
- Sidebar hidden

**Steps:**
1. Open in desktop browser
2. Open DevTools (F12)
3. Toggle device toolbar
4. Test at: 768px, 1024px, 1440px widths
5. Verify layout adapts

**Expected:**
- ✅ Content remains readable at all sizes
- ✅ Buttons are touchable (min 48px)
- ✅ No horizontal scrolling on mobile
- ✅ Email content is legible

---

### Test 6: Navigation
**Steps:**
1. Click different folder items (Inbox, Starred, Drafts, etc.)
2. Hover over folders → Should highlight
3. Observe active state styling
4. Click labels → Should respond to clicks

**Expected:**
- ✅ Folders show hover effect
- ✅ Active folder (Inbox) has highlighted appearance
- ✅ Folder counts display correctly
- ✅ Visual feedback on interaction

---

### Test 7: Logout
**Steps:**
1. Click the "↓" button in top-right
2. Should navigate to login page
3. Try accessing `/mail/inbox` directly
4. Should redirect to login (AuthGuard)

**Expected:**
- ✅ Logout clears localStorage tokens
- ✅ Navigates to `/login`
- ✅ Protected routes blocked without token
- ✅ Token cleared on page refresh

---

## Performance Testing

### Bundle Analysis
```bash
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/email-service/stats.json
```

**Expected Sizes:**
- Main bundle: ~2 KB (gzipped)
- Mail module: ~4 KB (gzipped)
- Styles: ~600 bytes (gzipped)
- Total initial: ~70 KB

### Load Time
- First load: < 2 seconds
- Mail module lazy load: < 1 second
- Search response: < 100ms

### Browser DevTools Metrics
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2s
- Cumulative Layout Shift (CLS): < 0.1

---

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Full support |
| Firefox | Latest | ✅ Full support |
| Safari | Latest | ✅ Full support |
| Edge | Latest | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Full support |
| Chrome Mobile | Latest | ✅ Full support |

---

## Accessibility Testing

### Keyboard Navigation
```
Tab → Navigate through interactive elements
Enter → Activate buttons/links
Escape → Close modals/panels
```

**Expected:**
- ✅ All buttons/links accessible via Tab
- ✅ Visual focus indicators visible
- ✅ Proper button roles in markup

### Screen Readers
- Email items have semantic structure
- Forms have proper labels
- Buttons have descriptive text or aria-labels

---

## Common Issues & Solutions

### Issue 1: Port 4200 already in use
**Solution:**
```bash
npm start -- --port 4201
# or
lsof -ti:4200 | xargs kill -9  # Kill process on 4200
```

### Issue 2: Blank screen after login
**Solution:**
- Check browser console for errors
- Verify AuthGuard is configured
- Check mail-module.ts routing

### Issue 3: Search not working
**Solution:**
- Clear search box and type again
- Refresh page (F5)
- Check browser console for JS errors

### Issue 4: Mobile layout broken
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check viewport meta tag in index.html

---

## Debugging

### Enable Debug Mode
```typescript
// In app.config.ts, add:
import { enableDebugTools } from '@angular/platform-browser';

ngZone.run(() => {
  enableDebugTools(componentRef);
});
```

### Check Console for Errors
Open DevTools (F12) → Console tab
Look for red errors

### View Network Traffic
DevTools → Network tab
Check API calls and asset loading

---

## Production Build

### Build for Production
```bash
npm run build
# Output: dist/email-service/
```

### Deploy to Server
```bash
# Copy dist/ folder to your server
scp -r dist/email-service/* user@server:/var/www/email-app/

# Or deploy to services like:
# - Vercel: npm install -g vercel && vercel
# - Netlify: npm run build && netlify deploy
# - GitHub Pages: npm run build && gh-pages -d dist
```

### Verify Production Build
```bash
# Serve production build locally
npx http-server dist/email-service
# Visit http://localhost:8080
```

---

## Monitoring & Analytics

### Add Analytics
```typescript
// In app.ts or main.ts
import { gtag } from 'ga';
gtag('event', 'login', { email: userEmail });
```

### Error Tracking
- Integrate Sentry, LogRocket, or Rollbar
- Monitor console errors
- Track user sessions

---

## Security Checklist

- [ ] No sensitive data in localStorage (tokens only)
- [ ] HttpOnly cookies for production (implement)
- [ ] CSRF protection (add if backend changes)
- [ ] Input validation on all forms
- [ ] XSS protection (Angular provides by default)
- [ ] SQL injection prevention (backend responsibility)
- [ ] HTTPS only in production
- [ ] Content Security Policy headers

---

## Migration to Backend

When connecting to real API:

1. **Update AuthService:**
```typescript
login(email: string, password: string): Observable<AuthResponse> {
  return this.http.post('/api/auth/login', { email, password });
}
```

2. **Update InboxComponent:**
```typescript
constructor(private emailService: EmailService) {}

ngOnInit() {
  this.emailService.getInbox().subscribe(emails => {
    this.emails.set(emails);
  });
}
```

3. **Add HTTP Interceptor for Auth Token:**
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = localStorage.getItem('auth_token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next.handle(req);
}
```

---

## Performance Optimization Ideas

1. **Virtual Scrolling** - For 1000+ emails
2. **Image Optimization** - Compress avatars
3. **Code Splitting** - Already lazy-loading mail
4. **Change Detection** - OnPush strategy ready
5. **Memoization** - Cache search results
6. **Pagination** - Load emails in chunks
7. **Service Workers** - Add PWA support
8. **WebWorkers** - For heavy filtering

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 4, 2026 | Initial UI implementation |
| 1.1.0 | TBD | Backend API integration |
| 1.2.0 | TBD | Email compose feature |
| 2.0.0 | TBD | Mobile app (React Native) |
