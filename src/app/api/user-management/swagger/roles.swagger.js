/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Name of the role (must be unique)
 *           example: "admin"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         created_by:
 *           type: string
 *           description: Username who created the role
 *           example: "admin"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *         updated_by:
 *           type: string
 *           description: Username who last updated the role
 *           example: "admin"
 *         RolePermission:
 *           type: array
 *           description: Associated permissions for this role
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               Permission:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440002"
 *                   name:
 *                     type: string
 *                     example: "user.read"
 *     
 *     RoleCreateRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Role name (must be unique)
 *           example: "editor"
 *         permissions:
 *           type: array
 *           description: Array of permission IDs to assign to the role
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440003"]
 *     
 *     RoleUpdateRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Role name (must be unique)
 *           example: "senior_editor"
 *         permissions:
 *           type: array
 *           description: Array of permission IDs to assign to the role
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440003"]
 *     
 *     RoleSelect:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: Role name
 *           example: "admin"
 *     
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
 * /api/user-management/roles:
 *   get:
 *     summary: Get list of roles with pagination, sorting, and filtering
 *     description: |
 *       Retrieve a paginated list of roles with optional search, sorting, and filtering capabilities.
 *       This endpoint supports:
 *       - **Search**: Filter roles by name (case-insensitive)
 *       - **Pagination**: Control page size and navigation
 *       - **Sorting**: Sort by any role field in ascending or descending order
 *       - **Permissions**: Requires 'role.read' permission
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search roles by name (case-insensitive partial match)
 *         required: false
 *         example: "admin"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination (starts from 1)
 *         required: false
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page (maximum 100)
 *         required: false
 *         example: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, created_at, created_by, updated_at, updated_by]
 *           default: name
 *         description: Field name to sort by
 *         required: false
 *         example: "created_at"
 *       - in: query
 *         name: dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction (ascending or descending)
 *         required: false
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Successfully retrieved roles list
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
 *                     message:
 *                       example: "Successfully fetching"
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "admin"
 *                   created_at: "2024-01-01T00:00:00.000Z"
 *                   created_by: "system"
 *                   updated_at: "2024-01-01T00:00:00.000Z"
 *                   updated_by: "system"
 *                   RolePermission:
 *                     - id: "550e8400-e29b-41d4-a716-446655440001"
 *                       Permission:
 *                         id: "550e8400-e29b-41d4-a716-446655440002"
 *                         name: "user.read"
 *                 - id: "550e8400-e29b-41d4-a716-446655440004"
 *                   name: "editor"
 *                   created_at: "2024-01-02T00:00:00.000Z"
 *                   created_by: "admin"
 *                   updated_at: "2024-01-02T00:00:00.000Z"
 *                   updated_by: "admin"
 *                   RolePermission: []
 *               pagination:
 *                 total: 2
 *                 page: 1
 *                 limit: 10
 *               status: 200
 *               message: "Successfully fetching"
 *       401:
 *         description: Unauthorized - No valid access token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *       403:
 *         description: Forbidden - User lacks required permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Forbidden: Insufficient permissions to read roles"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong. Please try again in a moment."
 *   
 *   post:
 *     summary: Create a new role with permissions
 *     description: |
 *       Create a new role and optionally assign permissions to it.
 *       This endpoint:
 *       - Validates role name uniqueness
 *       - Creates role-permission associations
 *       - Requires 'role.create' permission
 *       - Requires admin role
 *       - Provides audit trail (created_by field)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleCreateRequest'
 *           example:
 *             name: "editor"
 *             permissions: ["550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440003"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *             example:
 *               message: "Role created successfully"
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440005"
 *                 name: "editor"
 *                 created_at: "2024-01-03T00:00:00.000Z"
 *                 created_by: "admin"
 *       400:
 *         description: Bad request - validation error or duplicate role name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicate_name:
 *                 summary: Duplicate role name
 *                 value:
 *                   message: "Name must be unique"
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   message: "Invalid input. Please check your data and try again."
 *       401:
 *         description: Unauthorized - no valid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *       403:
 *         description: Forbidden - insufficient permissions or admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               insufficient_permissions:
 *                 summary: Insufficient permissions
 *                 value:
 *                   message: "Forbidden: Insufficient permissions to create roles"
 *               admin_required:
 *                 summary: Admin role required
 *                 value:
 *                   message: "Forbidden: Admin role required to create roles"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong. Please try again in a moment."
 * 
 * /api/user-management/roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     description: |
 *       Update an existing role's details and permissions.
 *       This endpoint:
 *       - Validates role name uniqueness (excluding current role)
 *       - Updates role-permission associations (replaces existing permissions)
 *       - Requires 'role.update' permission
 *       - Requires admin role
 *       - Provides audit trail (updated_by field)
 *       - Uses transaction to ensure data consistency
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the role to update
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleUpdateRequest'
 *           example:
 *             name: "senior_editor"
 *             permissions: ["550e8400-e29b-41d4-a716-446655440002", "550e8400-e29b-41d4-a716-446655440003"]
 *     responses:
 *       201:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role update successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *             example:
 *               message: "Role update successfully"
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "senior_editor"
 *                 created_at: "2024-01-01T00:00:00.000Z"
 *                 created_by: "admin"
 *                 updated_at: "2024-01-03T00:00:00.000Z"
 *                 updated_by: "admin"
 *       400:
 *         description: Bad request - validation error or duplicate role name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               duplicate_name:
 *                 summary: Duplicate role name
 *                 value:
 *                   message: "Name must be unique"
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   message: "Invalid input. Please check your data and try again."
 *               invalid_id:
 *                 summary: Invalid role ID
 *                 value:
 *                   message: "Invalid Input"
 *       401:
 *         description: Unauthorized - No valid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *       403:
 *         description: Forbidden - insufficient permissions or admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               insufficient_permissions:
 *                 summary: Insufficient permissions
 *                 value:
 *                   message: "Forbidden: Insufficient permissions to create roles"
 *               admin_required:
 *                 summary: Admin role required
 *                 value:
 *                   message: "Forbidden: Admin role required to update roles"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Record not found. Someone might have deleted it already."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong. Please try again in a moment."
 * 
 * /api/user-management/roles/select:
 *   get:
 *     summary: Get simplified list of roles for dropdown/select components
 *     description: |
 *       Retrieve a simplified list of all roles without pagination or filtering.
 *       This endpoint is designed for use in dropdown menus, select components, or
 *       other UI elements that need a simple list of available roles.
 *       The response includes only essential role information (ID and name).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: Successfully retrieved roles list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoleSelect'
 *             example:
 *               - id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "admin"
 *               - id: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "editor"
 *               - id: "550e8400-e29b-41d4-a716-446655440002"
 *                 name: "viewer"
 *               - id: "550e8400-e29b-41d4-a716-446655440003"
 *                 name: "moderator"
 *       401:
 *         description: Unauthorized - No valid access token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong, Please try again in a moment"
 */ 