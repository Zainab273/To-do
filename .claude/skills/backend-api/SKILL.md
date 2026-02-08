---
name: backend-api
description: Build REST API routes with request/response handling and database connections. Use for server-side logic and data persistence.
---

# Backend API Development

## Instructions

1. **Route Structure**
   - RESTful endpoint design
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Clear URL patterns and naming

2. **Request Handling**
   - Input validation and sanitization
   - Parse request body, params, and query strings
   - Handle different content types (JSON, form data)

3. **Response Formatting**
   - Consistent JSON structure
   - Appropriate HTTP status codes
   - Error messages and success responses

4. **Database Integration**
   - Connection pooling setup
   - Query building and execution
   - Transaction management
   - ORM/query builder usage

## Best Practices

- Validate all inputs before processing
- Use environment variables for sensitive data
- Implement proper error handling with try-catch
- Return meaningful error messages
- Use async/await for database operations
- Implement middleware for common tasks (auth, logging)
- Keep route handlers thin, business logic separate
- Use prepared statements to prevent SQL injection

