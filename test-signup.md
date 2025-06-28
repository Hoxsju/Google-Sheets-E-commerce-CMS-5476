# Signup Account Testing Guide

## 🧪 **Testing Strategy**

### **1. Start the Application**
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

### **2. Test Signup Flow**

#### **Valid Signup Test Cases:**
1. **Basic Valid Registration**
   - Name: "John Doe"
   - Email: "john@example.com" 
   - Password: "password123"
   - Confirm Password: "password123"
   - Expected: ✅ Success, redirect to home, user logged in

2. **Edge Case - Minimum Password**
   - Name: "Jane Smith"
   - Email: "jane@example.com"
   - Password: "123456" (exactly 6 characters)
   - Confirm Password: "123456"
   - Expected: ✅ Success

3. **Special Characters in Name**
   - Name: "José María O'Connor"
   - Email: "jose@example.com"
   - Password: "securepass"
   - Confirm Password: "securepass"
   - Expected: ✅ Success

#### **Invalid Signup Test Cases:**
1. **Password Too Short**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "12345" (5 characters)
   - Expected: ❌ Error: "Password must be at least 6 characters"

2. **Passwords Don't Match**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm Password: "password124"
   - Expected: ❌ Error: "Passwords do not match"

3. **Invalid Email Format**
   - Name: "Test User"
   - Email: "invalid-email"
   - Password: "password123"
   - Expected: ❌ Browser validation error

4. **Duplicate Email**
   - Try registering with same email twice
   - Expected: ❌ Error: "User already exists"

5. **Empty Fields**
   - Leave any field empty
   - Expected: ❌ Form validation prevents submission

### **3. Database Verification**

After successful signup, verify the user was created:

```sql
-- Check if user exists in database
SELECT id, name, email, is_admin, created_at 
FROM users 
WHERE email = 'john@example.com';
```

### **4. Authentication Flow Testing**

1. **Signup → Auto Login**
   - Complete signup
   - Verify user is automatically logged in
   - Check if JWT token is stored in localStorage

2. **Logout → Login**
   - Logout after signup
   - Try logging in with same credentials
   - Verify successful login

## 🔧 **Testing Tools**

### **Browser Developer Tools**
1. **Network Tab**: Monitor API requests
2. **Application Tab**: Check localStorage for JWT token
3. **Console**: Look for any JavaScript errors

### **API Testing with curl**
```bash
# Test signup endpoint directly
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🐛 **Common Issues & Solutions**

### **Issue 1: Server Connection Error**
- **Symptoms**: "Failed to fetch" error
- **Solution**: Ensure backend server is running on port 3001

### **Issue 2: Database Not Initialized**
- **Symptoms**: SQL errors in server console
- **Solution**: Restart server to reinitialize database

### **Issue 3: CORS Errors**
- **Symptoms**: CORS policy errors in browser
- **Solution**: Check CORS configuration in server/index.js

### **Issue 4: Password Validation**
- **Symptoms**: Weak passwords accepted
- **Solution**: Frontend validation should catch this

## 📊 **Expected Server Responses**

### **Successful Signup (201)**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Validation Error (400)**
```json
{
  "message": "Password must be at least 6 characters"
}
```

### **Duplicate Email (400)**
```json
{
  "message": "User already exists"
}
```

## ✅ **Test Checklist**

- [ ] Valid signup with all fields
- [ ] Password confirmation validation
- [ ] Minimum password length (6 chars)
- [ ] Email format validation
- [ ] Duplicate email prevention
- [ ] Required field validation
- [ ] Auto-login after signup
- [ ] JWT token storage
- [ ] Database record creation
- [ ] Error message display
- [ ] Loading states
- [ ] Responsive design
- [ ] Accessibility (tab navigation)

## 🔍 **Advanced Testing**

### **Security Testing**
1. **SQL Injection**: Try malicious inputs
2. **XSS Prevention**: Test script injection
3. **Password Hashing**: Verify passwords are hashed in DB

### **Performance Testing**
1. **Multiple Rapid Signups**: Test rate limiting
2. **Large Input Values**: Test field limits
3. **Concurrent Signups**: Test database locking

### **UI/UX Testing**
1. **Form Validation Feedback**: Clear error messages
2. **Loading States**: Spinner during submission
3. **Success Feedback**: Toast notifications
4. **Mobile Responsiveness**: Test on different screen sizes