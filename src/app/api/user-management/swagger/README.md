# User Management API Swagger Documentation

## Overview

This directory contains separated Swagger JSDoc documentation files for the User Management API. The documentation is organized into individual files for better maintainability and readability.

## File Structure

```
swagger/
├── index.js                    # Main index file with global configurations
├── roles.swagger.js           # Roles management endpoints
├── users.swagger.js           # Users management endpoints
├── profile.swagger.js         # User profile endpoints
├── permissions.swagger.js     # Permissions management endpoints
├── rolepermissions.swagger.js # Role-permission association endpoints
└── README.md                  # This file
```

## Files Description

### `index.js`
- **Purpose**: Main configuration file that imports all documentation files
- **Contains**: 
  - Global API information (title, description, version)
  - Server configurations
  - Security schemes
  - Common schemas and error responses
  - Tag definitions

### `roles.swagger.js`
- **Endpoints**: 
  - `GET /api/user-management/roles` - List roles with pagination
  - `POST /api/user-management/roles` - Create new role
  - `PUT /api/user-management/roles/{id}` - Update role
  - `GET /api/user-management/roles/select` - Simplified role list for dropdowns
- **Schemas**: Role, RoleCreateRequest, RoleUpdateRequest, RoleSelect

### `users.swagger.js`
- **Endpoints**:
  - `GET /api/user-management/users` - List users with pagination
  - `POST /api/user-management/users` - Create new user
  - `GET /api/user-management/users/select` - Simplified user list for dropdowns
- **Schemas**: User, UserCreateRequest, UserSelect, UserSelectResponse

### `profile.swagger.js`
- **Endpoints**:
  - `GET /api/user-management/profile` - Get current user profile
- **Schemas**: UserProfile, ProfileResponse

### `permissions.swagger.js`
- **Endpoints**:
  - `GET /api/user-management/permissions` - List permissions with pagination
  - `GET /api/user-management/permissions/select` - Simplified permission list for dropdowns
- **Schemas**: Permission, PermissionSelect

### `rolepermissions.swagger.js`
- **Endpoints**:
  - `GET /api/user-management/rolepermissions` - List role permissions with pagination
  - `GET /api/user-management/rolepermissions/select` - Simplified role permission list
- **Schemas**: RolePermission, RolePermissionSelect, RolePermissionSelectResponse

## Usage

### Importing Documentation

To use these documentation files in your Swagger configuration:

```javascript
// In your main Swagger config file
import '@/app/api/user-management/swagger/index.js';
```

### Adding New Endpoints

1. **Create a new file** for your endpoint group (e.g., `newfeature.swagger.js`)
2. **Add the import** to `index.js`
3. **Follow the existing structure** with proper schemas and examples

### Example Structure for New File

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     YourEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 * 
 * /api/your-endpoint:
 *   get:
 *     summary: Your endpoint summary
 *     description: Detailed description
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Your Tag
 *     responses:
 *       200:
 *         description: Success response
 */
```

## Benefits of This Structure

### 1. **Maintainability**
- Each endpoint group is in its own file
- Easy to locate and modify specific endpoints
- Clear separation of concerns

### 2. **Readability**
- Smaller, focused files
- No overwhelming large documentation blocks
- Easy to navigate and understand

### 3. **Reusability**
- Common schemas defined in index.js
- Consistent error responses
- Shared components across files

### 4. **Scalability**
- Easy to add new endpoint groups
- Modular structure supports growth
- Clear organization for large APIs

## Common Patterns

### Request/Response Schemas
Each endpoint file includes:
- **Entity Schemas**: Main data structures
- **Request Schemas**: Input validation schemas
- **Response Schemas**: Output data structures
- **Error Schemas**: Error response formats

### Parameter Documentation
All query parameters include:
- **Type and validation**: Data type, min/max values, enums
- **Description**: Clear explanation of purpose
- **Examples**: Realistic example values
- **Required/Optional**: Clear indication of necessity

### Response Examples
Each response includes:
- **Success examples**: Realistic data examples
- **Error examples**: Common error scenarios
- **Multiple status codes**: 200, 400, 401, 403, 404, 500

## Best Practices

### 1. **Consistent Naming**
- Use descriptive schema names
- Follow camelCase for properties
- Use clear, meaningful descriptions

### 2. **Comprehensive Examples**
- Provide realistic UUIDs
- Use proper date formats (ISO 8601)
- Include edge cases and error scenarios

### 3. **Security Documentation**
- Always include security requirements
- Document permission requirements
- Explain authentication methods

### 4. **Error Handling**
- Document all possible error responses
- Provide meaningful error messages
- Include error codes and descriptions

## Integration with Swagger UI

When properly configured, these files will generate a comprehensive Swagger UI that includes:

- **Interactive Documentation**: Test endpoints directly
- **Schema Validation**: Validate request/response data
- **Authentication**: Test with JWT tokens
- **Examples**: Pre-filled request examples
- **Error Documentation**: Clear error explanations

## Maintenance

### Regular Updates
- Update examples when API changes
- Add new endpoints as they're developed
- Review and update error responses
- Keep schemas in sync with actual implementation

### Version Control
- Track changes to documentation
- Update version numbers when needed
- Maintain changelog for API changes

## Support

For questions about the documentation structure or implementation:
- Check this README file
- Review existing files for patterns
- Consult the Swagger specification
- Refer to the main API implementation 