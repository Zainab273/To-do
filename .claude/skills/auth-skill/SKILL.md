---
name: auth-skill
description: Implement secure authentication with signup, signin, password hashing, JWT tokens, and Better Auth integration. Use for building authentication systems.
---

# Auth Skill – Authentication & Authorization

## Instructions

1. **Authentication Setup**
   - Install Better Auth or equivalent auth library
   - Configure environment variables (secret keys, database URL)
   - Set up auth routes and API endpoints
   - Initialize auth provider/context

2. **User Registration (Signup)**
   - Create signup form with validation
   - Hash passwords using bcrypt/argon2
   - Store user credentials securely in database
   - Generate verification tokens if needed
   - Handle duplicate email/username errors

3. **User Login (Signin)**
   - Create login form with validation
   - Verify credentials against hashed passwords
   - Generate JWT tokens upon successful login
   - Set secure HTTP-only cookies
   - Implement refresh token rotation

4. **JWT Token Management**
   - Generate access tokens (short-lived, 15min-1hr)
   - Generate refresh tokens (long-lived, 7-30 days)
   - Include user ID and roles in token payload
   - Sign tokens with secret key
   - Verify tokens on protected routes

5. **Better Auth Integration**
   - Configure Better Auth with database adapter
   - Set up OAuth providers (Google, GitHub, etc.)
   - Implement session management
   - Configure middleware for route protection
   - Handle social login callbacks

## Best Practices

### Security
- **Never store plain text passwords** – always hash with bcrypt (min 10 rounds) or argon2
- **Use HTTP-only cookies** for tokens to prevent XSS attacks
- **Implement CSRF protection** on auth endpoints
- **Use secure, random secrets** for JWT signing (min 256 bits)
- **Validate and sanitize** all user inputs
- **Rate limit** login attempts to prevent brute force
- **Use HTTPS** in production

### Token Strategy
- Access tokens: short-lived (15min-1hr), stored in memory or HTTP-only cookie
- Refresh tokens: long-lived (7-30 days), stored in HTTP-only cookie
- Include minimal data in tokens (user ID, roles only)
- Implement token refresh flow before expiration

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, symbols
- Check against common password lists
- Provide clear password strength feedback

### User Experience
- Clear error messages (avoid revealing if email exists)
- Loading states during auth operations
- Redirect after successful login
- "Remember me" functionality with refresh tokens
- Password reset flow with email verification

