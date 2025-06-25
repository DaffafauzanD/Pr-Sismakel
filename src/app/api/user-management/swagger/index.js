/**
 * User Management API Swagger Documentation
 * 
 * This file serves as an index for all Swagger documentation files.
 * Import this file in your main Swagger configuration to include all endpoints.
 */

// Import all Swagger documentation files
import './roles.swagger.js';
import './users.swagger.js';
import './profile.swagger.js';
import './permissions.swagger.js';
import './rolepermissions.swagger.js';

/**
 * @swagger
 * info:
 *   title: User Management API
 *   description: |
 *     Comprehensive API for managing users, roles, permissions, and role-permission associations.
 *     This API provides full CRUD operations with RBAC (Role-Based Access Control) support.
 *     
 *     ## Features
 *     - **User Management**: Create, read, update users with role assignments
 *     - **Role Management**: Manage roles with permission associations
 *     - **Permission Management**: View available permissions
 *     - **Role-Permission Management**: Manage role-permission relationships
 *     - **Profile Management**: Get current user profile with permissions
 *     
 *     ## Authentication
 *     All endpoints require Bearer token authentication:
 *     ```
 *     Authorization: Bearer <your-jwt-token>
 *     ```
 *     
 *     ## Permissions
 *     Each endpoint requires specific permissions:
 *     - `user.read` - Read user data
 *     - `user.create` - Create users
 *     - `role.read` - Read role data
 *     - `role.create` - Create roles
 *     - `role.update` - Update roles
 *     - `permission.read` - Read permission data
 *     
 *     ## Common Features
 *     - **Pagination**: All list endpoints support pagination
 *     - **Sorting**: Sort by any field in ascending/descending order
 *     - **Search**: Text-based filtering on relevant fields
 *     - **Audit Trail**: All operations include created_by/updated_by fields
 *     
 *     ## Response Format
 *     All endpoints return consistent JSON responses with proper error handling.
 *   version: 1.0.0
 *   contact:
 *     name: API Support
 *     email: support@example.com
 * 
 * servers:
 *   - url: http://localhost:3000
 *     description: Development server
 *   - url: https://api.example.com
 *     description: Production server
 * 
 * security:
 *   - bearerAuth: []
 * 
 * tags:
 *   - name: Users
 *     description: User management operations
 *   - name: Roles
 *     description: Role management operations
 *   - name: Permissions
 *     description: Permission management operations
 *   - name: Role Permissions
 *     description: Role-permission association operations
 *   - name: Profile
 *     description: User profile operations
 * 
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication
 * 
 *   schemas:
 *     # Common schemas that can be reused across endpoints
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total number of records
 *           example: 100
 *         page:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *           example: 10
 *     
 *     ApiResponse:
 *       type: object
 *       properties:
 *         data:
 *           description: Response data
 *         pagination:
 *           $ref: '#/components/schemas/PaginationInfo'
 *         status:
 *           type: integer
 *           description: HTTP status code
 *         message:
 *           type: string
 *           description: Response message
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: object
 *           description: Error details (optional)
 * 
 *     # Common error responses
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *     
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Forbidden: Insufficient permissions"
 *     
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Record not found. Someone might have deleted it already."
 *     
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Invalid input. Please check your data and try again."
 *     
 *     ConflictError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Name must be unique"
 *     
 *     InternalServerError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Oops! Something went wrong. Please try again in a moment."
 *         error:
 *           type: object
 *           description: Error details
 * 
 * # Global responses that can be referenced
 * responses:
 *   Unauthorized:
 *     description: Unauthorized - No valid access token provided
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/UnauthorizedError'
 *   
 *   Forbidden:
 *     description: Forbidden - User lacks required permissions
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ForbiddenError'
 *   
 *   NotFound:
 *     description: Not found - Resource not found
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/NotFoundError'
 *   
 *   ValidationError:
 *     description: Bad request - Validation error
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ValidationError'
 *   
 *   Conflict:
 *     description: Conflict - Resource already exists
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ConflictError'
 *   
 *   InternalServerError:
 *     description: Internal server error
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/InternalServerError'
 */

export default {}; 