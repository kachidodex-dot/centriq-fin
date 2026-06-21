# Ryport Security Guidelines

## Overview
This document outlines the security practices and recommendations for the Ryport financial management application.

## Authentication & Authorization

### Rate Limiting
- **Location**: `src/lib/security.ts`
- **Strategy**: In-memory rate limiting for authentication endpoints
- **Configuration**:
  - Max attempts: 5 failed attempts per user per 15 minutes
  - Lockout duration: 30 minutes after max attempts exceeded
- **Production**: Replace with distributed rate limiting (Redis, Memcached) for multi-server deployments
- **Used in**:
  - Login/sign-up endpoints
  - Password reset flows

### Email Validation
- **Implementation**: RFC 5322 simplified regex pattern
- **Max length**: 254 characters
- **Applied to**: All authentication forms before submission

### Password Security
- **Requirements** (enforced via `validatePasswordStrength`):
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 digit
- **Transmission**: Always over HTTPS
- **Storage**: Delegated to Supabase Auth (uses bcrypt)

### Role-Based Access Control (RBAC)
- **Roles**: `admin`, `user`
- **Storage**: `user_roles` table in Supabase
- **Enforcement**: Both client-side (auth context) and server-side (middleware)
- **Admin Protection**: Only users with `admin` role can access `/admin` routes

## API Security

### Request Validation
- **Middleware**: `auth-middleware.ts` enforces bearer token authentication
- **Token validation**: Uses Supabase JWT claims verification
- **Header requirements**: `Authorization: Bearer <token>`

### Input Sanitization
- **Function**: `sanitizeInput()` in `src/lib/security.ts`
- **Purpose**: Prevents XSS attacks by escaping HTML special characters
- **Applied to**: User-generated content before display

### CSRF Protection
- **Status**: Framework-provided by TanStack Start
- **Recommendation**: Verify CSRF tokens on all state-changing operations
- **Configuration needed**: Add `CSRF_SECRET` environment variable

## Environment Variables

### Sensitive Information Storage
- **Never commit**: `.env.local`, `.env.*.local` files (already in `.gitignore`)
- **API Keys**: Store in environment variables, not in code
- **Examples**:
  - `LOVABLE_API_KEY` - AI gateway authentication
  - `SUPABASE_URL` - Database connection URL
  - `SESSION_SECRET` - Session encryption key

### Required Security Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
LOVABLE_API_KEY=your_api_key
SESSION_SECRET=generate_strong_random_string
CSRF_SECRET=generate_strong_random_string
```

### Variable Validation
- Application checks for missing critical variables on startup
- Clear error messages if configuration is incomplete

## Database Security (Supabase)

### Row-Level Security (RLS)
- **Status**: Should be enabled on all tables
- **Policies needed**: Verify that users can only access their own data
- **Tables requiring RLS**:
  - `transactions` - Users see only their transactions
  - `profiles` - Users can only modify their profile
  - `email_accounts` - Users access only their accounts
  - `user_roles` - Read-only for users (admin-managed)

### Data Access Patterns
- **Transactions**: Filtered by `user_id` in queries
- **Profiles**: Owner can update, all users can read (business name, etc.)
- **Admin data**: Only accessible to users with `admin` role

### Connection Security
- **SSL/TLS**: All database connections use HTTPS
- **Connection pooling**: Recommended for production

## Error Handling & Logging

### Error Capture System
- **Location**: `src/lib/error-capture.ts`
- **Purpose**: Recovers stack traces from swallowed server errors
- **Structured logging**: JSON format with timestamp, source, and message
- **TTL**: Errors expire after 5 seconds to prevent memory leaks

### Information Disclosure
- **Development**: Full error details shown in development mode
- **Production**: Generic error page shown, detailed errors logged server-side
- **File**: `src/lib/error-page.ts` - Branded 500 error template

### Monitoring
- **Recommendation**: Set up error tracking service (e.g., Sentry)
- **Environment variable**: `SENTRY_DSN` (currently unused)
- **Critical logs**: Track failed authentication attempts, role changes

## Frontend Security

### XSS Prevention
- **React**: Built-in JSX escaping prevents most XSS
- **Custom escaping**: Use `sanitizeInput()` for user-generated content
- **HTML content**: Never use `dangerouslySetInnerHTML` without sanitization

### Secure Session Storage
- **Method**: Supabase Auth stores session in `localStorage` (web)
- **Auto-refresh**: Enabled for token refresh
- **SSR consideration**: Session re-validated on server-side render

### Content Security Policy
- **Recommendation**: Add CSP headers to prevent injection attacks
- **Implementation**: Configure in server response headers or web server

## Deployment Security

### Environment Checklist
- [ ] All `.local` files are in `.gitignore`
- [ ] `LOVABLE_API_KEY` is secret and not in repository
- [ ] `SESSION_SECRET` and `CSRF_SECRET` are strong random strings
- [ ] Supabase RLS policies are enabled and tested
- [ ] Database backups are configured
- [ ] HTTPS is enforced (SSL certificates valid)

### Server Configuration
- [ ] Use production Supabase project (not development)
- [ ] Enable audit logging for admin actions
- [ ] Configure firewall rules
- [ ] Use environment-specific secrets management
- [ ] Enable rate limiting at server/edge level

### Monitoring & Alerts
- [ ] Error tracking service configured (Sentry, etc.)
- [ ] Failed authentication attempts logged and monitored
- [ ] Admin action audits configured
- [ ] Database query logs reviewed regularly

## Security Audit Checklist

### Before Production Deployment
- [ ] All dependencies audited (`npm audit`)
- [ ] No hardcoded secrets or API keys
- [ ] Rate limiting configured and tested
- [ ] Email validation working on auth forms
- [ ] Password requirements enforced
- [ ] RLS policies tested and verified
- [ ] Error pages don't leak sensitive information
- [ ] HTTPS enforced everywhere
- [ ] Admin routes protected and tested
- [ ] Session timeouts configured appropriately

### Regular Maintenance
- [ ] Monthly dependency updates and security patches
- [ ] Quarterly security review of auth flows
- [ ] Bi-annual penetration testing (recommended)
- [ ] Regular backup testing and verification

## Incident Response

### If a Security Issue is Discovered
1. **Assessment**: Determine severity and scope of impact
2. **Containment**: Temporarily disable affected feature if needed
3. **Fix**: Apply security patches immediately
4. **Testing**: Verify fix doesn't introduce new issues
5. **Deployment**: Deploy fix to production ASAP
6. **Notification**: Inform affected users if necessary
7. **Documentation**: Update this security guide

### Reporting Security Issues
- **Do not**: Create public GitHub issues for security vulnerabilities
- **Do**: Email security concerns to admin
- **Include**: Description, reproduction steps, and potential impact

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [React Security Best Practices](https://react.dev/learn/security)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

**Last Updated**: 2026-06-15  
**Review Schedule**: Quarterly or after major changes
