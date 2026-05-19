# 🚀 Quick Access Guide - Admin Dashboard

## How to Get Into the Admin Page

### 1. Start the Development Server

```bash
cd c:\Users\PC\Desktop\zentriq\centriq-fin
npm run dev
```

The app will start at `http://localhost:5173`

### 2. Navigate to Admin Login

Go to:
```
http://localhost:5173/admin/login
```

### 3. Demo Credentials

**Email:** `admin@zentriq.com`  
**Password:** `demo123456`

Click **Sign In**

### 4. You're In! 🎉

You'll be redirected to the admin dashboard at:
```
http://localhost:5173/admin
```

---

## What's New ✨

### Dark Mode Toggle
- **Location**: Top-right header (next to notifications)
- **Button**: Sun/Moon icon
- **Function**: Click to toggle between light and dark modes
- **Status**: Preference is saved in browser localStorage

### Real Data Integration
The dashboard now fetches **real data** from your Supabase database:
- ✅ **Total Users** - Counts actual users from `profiles` table
- ✅ **User Management** - Shows real users with their details
- ✅ **Transactions** - Fetches from your `transactions` table
- ✅ **Business Count** - Calculated from user data

### Company Logo
- **Location**: Top-left sidebar
- **Logo**: Using your Zentriq company logo (`zentriq-logo.jpeg`)
- **Responsive**: Works on mobile and desktop

---

## Dashboard Pages Access

Once logged in, use the **left sidebar** to navigate:

| Page | URL | What It Shows |
|------|-----|--------------|
| **Dashboard** | `/admin` | Overview & key metrics |
| **Users** | `/admin/users` | User management table |
| **Transactions** | `/admin/transactions` | Transaction monitoring |
| **Reports** | `/admin/reports` | Analytics & reports |
| **Feedback** | `/admin/feedback` | Support tickets |
| **Activity Logs** | `/admin/activity` | Platform activity timeline |
| **Settings** | `/admin/settings` | Platform configuration |

---

## Features

### 🌓 Dark Mode
- Toggle between light and dark themes
- Preference saved to browser
- Smooth transitions
- Works on all pages

### 📊 Real Data
- Live user count from database
- Real transaction data
- Actual business statistics
- Dynamic metrics that update

### 🎨 Premium UI
- Modern, clean design
- Responsive on all devices
- Smooth animations
- Professional styling

### 🔐 Admin Features
- User search & filtering
- Transaction monitoring
- Feedback management
- Activity logging
- Settings panel

---

## Troubleshooting

### Page Won't Load?
- Make sure the dev server is running (`npm run dev`)
- Check browser console for errors (F12)
- Try clearing browser cache

### Dark Mode Not Working?
- Refresh the page (Ctrl+R)
- Clear localStorage: Open DevTools → Application → Clear All

### Data Not Showing?
- The dashboard falls back to mock data if Supabase connection fails
- Check your Supabase credentials in `.env`
- Both real and mock data work seamlessly

### Logo Not Showing?
- Check that `zentriq-logo.jpeg` exists in `src/assets/`
- Restart the dev server
- Clear browser cache

---

## Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Next Steps

1. **Login** to the admin dashboard
2. **Explore** all pages using the sidebar
3. **Toggle dark mode** with the sun/moon icon
4. **View real data** from your database
5. **Customize** as needed for your platform

---

**That's it! You now have a premium admin dashboard fully integrated with your Zentriq platform.** 🎊
