# Admin Dashboard Quick Start Guide

## 🚀 Quick Start

### 1. Access the Admin Dashboard

#### Development
```bash
cd centriq-fin
npm run dev
```

Then open your browser:
- **Login**: http://localhost:5173/admin/login
- **Dashboard**: http://localhost:5173/admin (after login)

#### Demo Credentials
```
Email: admin@zentriq.com
Password: demo123456
```

---

## 📍 Navigation

### Sidebar Menu Items
- **Overview** - Main dashboard with metrics
- **Users** - User management and statistics
- **Transactions** - Transaction monitoring
- **Reports** - Analytics and reports
- **Feedback** - Support tickets and feedback
- **Activity Logs** - Platform activity timeline
- **Settings** - Configuration and preferences

---

## 📊 Dashboard Pages Overview

### 1. Overview Dashboard (`/admin`)
**Main executive dashboard**

Shows:
- 4 key metric cards (Users, Businesses, Revenue, Daily Active)
- User growth chart
- Transaction volume chart
- Recent activity feed
- Quick stats (signups, transactions, AI usage)

**What you can do:**
- View platform KPIs at a glance
- Monitor growth trends
- Check recent platform activity
- See system health overview

---

### 2. User Management (`/admin/users`)
**Complete user management interface**

Shows:
- User statistics (total, active, suspended)
- Searchable user table
- Filter by status (Active, Suspended, Inactive)
- User details (name, email, business, plan, join date)

**What you can do:**
- Search users by name or email
- Filter by subscription plan or status
- View user profiles
- Suspend user accounts
- Delete users
- Monitor user metrics

**Table Columns:**
- User (with avatar)
- Business Name
- Email
- Plan (Starter/Pro/Enterprise)
- Status (Active/Suspended/Inactive)
- Join Date
- Actions dropdown

---

### 3. Transaction Monitoring (`/admin/transactions`)
**Real-time transaction tracking**

Shows:
- Transaction statistics (total, volume, large transactions)
- Transaction volume trend chart
- Alerts for large transactions (>$10,000)
- Searchable transaction table
- Filter by status (Completed, Pending, Failed)

**What you can do:**
- Monitor all transactions
- Search transactions by user or category
- Filter by transaction status
- Identify large transaction patterns
- Track transaction volume trends
- Analyze spending by category

**Table Columns:**
- User
- Category
- Amount
- Type (Debit/Credit)
- Date
- Status

---

### 4. Reports & Analytics (`/admin/reports`)
**Business intelligence and reporting**

Shows:
- 3 report types available (Daily Signups, Revenue, Platform Usage)
- Daily signups bar chart
- User growth trend line chart
- Key metrics (signup rate, growth %, churn, retention)
- Export buttons for each report

**What you can do:**
- Download individual reports (CSV/PDF)
- View daily signup trends
- Monitor user growth
- Export comprehensive reports for stakeholders
- Track platform KPIs
- Generate investor reports

---

### 5. Feedback & Support (`/admin/feedback`)
**Support ticket and feedback management**

Shows:
- Feedback statistics by status
- Filter buttons (All, New, In Progress, Resolved)
- Support ticket list with details
- Sentiment analysis (Positive, Suggestions, Issues)
- Feedback breakdown percentages

**What you can do:**
- View all user feedback and support tickets
- Filter by ticket status
- Reply to feedback
- Assign tickets to team members
- Mark tickets as resolved
- Track sentiment/feedback types

**Feedback Types:**
- **Positive** - Praise and positive feedback
- **Suggestion** - Feature requests and suggestions
- **Issue** - Bug reports and problems

---

### 6. Settings (`/admin/settings`)
**Platform configuration**

Shows:
- General settings form
- Feature toggle switches
- Theme selection
- Notification preferences
- Security settings

**What you can do:**
- Update platform name
- Set default currency
- Enable/disable maintenance mode
- Toggle AI features
- Choose color theme (Light/Dark/Auto)
- Configure notification preferences
- Set admin session timeout
- Configure 2FA requirements

**Settings Sections:**
1. **General** - Platform basics
2. **Feature Toggles** - Maintenance mode, AI features
3. **Theme** - Light/Dark mode
4. **Notifications** - Alert preferences
5. **Security** - Session and auth settings

---

### 7. Activity Logs (`/admin/activity`)
**Platform-wide activity tracking**

Shows:
- Activity statistics for today
- Activity timeline with icons
- Category filter dropdown
- Detailed event log table
- Export options (CSV, JSON)

**What you can do:**
- View all platform activities chronologically
- Filter by activity type (All, User Activity, Admin Actions, Transactions, System)
- Export activity logs for compliance
- Monitor admin actions
- Track user activities
- Review system events
- Audit platform changes

**Activity Types:**
- **Signup** - New user registrations
- **Transaction** - Payment/transaction activities
- **Delete** - User/data deletion events
- **Login** - User login events
- **Action** - General admin actions

---

## 🎨 UI Features

### Responsive Design
- **Mobile**: Full-screen sidebar (swipe to open)
- **Tablet**: Compact sidebar + full content
- **Desktop**: Fixed sidebar + full dashboard

### Interactive Elements
- **Search**: Real-time filtering in tables
- **Filters**: Dropdown filters for status/type
- **Dropdowns**: Context menus for actions
- **Charts**: Interactive charts with hover tooltips
- **Tabs**: Status filter buttons
- **Toggles**: Feature on/off switches

### Visual Feedback
- **Hover states**: All interactive elements have hover effects
- **Loading states**: Buttons show loading indicators
- **Success messages**: Settings save with confirmation
- **Status badges**: Color-coded status indicators
- **Trend indicators**: Green up/red down arrows

---

## 💡 Tips & Best Practices

### 1. Monitoring Users
- Regularly check the Users page for new signups
- Review suspended accounts
- Track subscription plan distribution
- Monitor for inactive accounts

### 2. Transaction Safety
- Watch for large transaction alerts
- Monitor failed transactions
- Track transaction trends
- Identify unusual patterns

### 3. Support Management
- Respond to new tickets quickly
- Track issue resolution
- Monitor feedback sentiment
- Use suggestions to guide product development

### 4. Performance Monitoring
- Check Overview dashboard daily
- Review growth metrics in Reports
- Monitor platform activity
- Track revenue trends

### 5. Admin Security
- Set reasonable session timeout
- Enable 2FA for admin accounts
- Review activity logs for suspicious activity
- Keep settings updated

---

## 🔍 Troubleshooting

### Login Issues
- Ensure you're using correct demo credentials
- Check browser console for errors
- Clear browser cache and try again

### Data Not Updating
- The dashboard uses mock data by default
- For real data, connect to Supabase backend
- Check browser Network tab for API errors

### Responsive Issues
- Try resizing browser window
- Test on different devices
- Check browser zoom level (should be 100%)

---

## 📱 Mobile Usage

The admin dashboard is fully mobile-responsive:

1. **Navigation**: Click hamburger menu (☰) to open sidebar
2. **Tables**: Scroll horizontally on small screens
3. **Charts**: Charts adapt to screen size
4. **Forms**: All inputs remain accessible
5. **Touch-friendly**: All buttons have adequate spacing

---

## 🔄 Common Workflows

### Daily Operations
1. Log in to admin dashboard
2. Check Overview for metrics
3. Review Users page for new signups
4. Monitor Transactions page
5. Check Feedback for support issues
6. Review Activity Logs for anomalies

### Weekly Tasks
1. Generate Reports
2. Export data for analysis
3. Review and respond to feedback
4. Check Settings for updates
5. Audit admin activity

### Monthly Tasks
1. Export full monthly reports
2. Analyze user growth trends
3. Review revenue metrics
4. Plan feature releases (from feedback)
5. Archive activity logs

---

## 🚀 Next Steps

To fully implement this dashboard:

1. **Authentication**: Connect Supabase auth
2. **Data**: Replace mock data with API calls
3. **Exports**: Implement CSV/PDF generation
4. **Notifications**: Set up real-time alerts
5. **API**: Create backend endpoints
6. **Database**: Set up PostgreSQL schema
7. **Permissions**: Add role-based access control

---

## 📞 Support

For questions or issues:
- Check ADMIN_DASHBOARD_README.md for detailed documentation
- Review component code for implementation details
- Check mock-data.ts for data structure examples

---

**Ready to go! Your premium admin dashboard is live.** 🎉
