/**
 * @swagger
 * components:
 *   schemas:
 *     RolePermission:
 *       type: object
 *       required:
 *         - id_role
 *         - id_permission
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role permission
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         id_role:
 *           type: string
 *           format: uuid
 *           description: Role ID
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         id_permission:
 *           type: string
 *           format: uuid
 *           description: Permission ID
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         create_date:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role permission was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         create_by:
 *           type: string
 *           description: Username who created the role permission
 *           example: "admin"
 *         update_date:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role permission was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *         update_by:
 *           type: string
 *           description: Username who last updated the role permission
 *           example: "admin"
 *         Role:
 *           type: object
 *           description: Associated role information
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               example: "admin"
 *         Permission:
 *           type: object
 *           description: Associated permission information
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440002"
 *             name:
 *               type: string
 *               example: "user.read"
 *     
 *     RolePermissionSelect:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the role permission
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         id_role:
 *           type: string
 *           format: uuid
 *           description: Role ID
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         id_permission:
 *           type: string
 *           format: uuid
 *           description: Permission ID
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         create_date:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role permission was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         create_by:
 *           type: string
 *           description: Username who created the role permission
 *           example: "admin"
 *         update_date:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the role permission was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *         update_by:
 *           type: string
 *           description: Username who last updated the role permission
 *           example: "admin"
 *         Role:
 *           type: object
 *           description: Associated role information
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               example: "admin"
 *         Permission:
 *           type: object
 *           description: Associated permission information
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440002"
 *             name:
 *               type: string
 *               example: "user.read"
 *     
 *     RolePermissionSelectResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RolePermissionSelect'
 *         message:
 *           type: string
 *           description: Response message
 *         status:
 *           type: integer
 *           description: HTTP status code
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
 * /api/user-management/rolepermissions:
 *   get:
 *     summary: Get list of role permissions with pagination, sorting, and filtering
 *     description: |
 *       Retrieve a paginated list of role permissions with optional search, sorting, and filtering capabilities.
 *       This endpoint supports:
 *       - **Search**: Filter by role name (case-insensitive)
 *       - **Pagination**: Control page size and navigation
 *       - **Sorting**: Sort by any role permission field in ascending or descending order
 *       - **Role Filtering**: Filter by specific role ID
 *       - **Relationships**: Includes both role and permission details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Role Permissions
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search by role name (case-insensitive partial match)
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
 *           enum: [roleName, permissionName, create_date, create_by, update_date, update_by]
 *           default: create_date
 *         description: Field name to sort by
 *         required: false
 *         example: "roleName"
 *       - in: query
 *         name: dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction (ascending or descending)
 *         required: false
 *         example: "desc"
 *       - in: query
 *         name: id_role
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by specific role ID (use 'all' to show all roles)
 *         required: false
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Successfully retrieved role permissions list
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
 *                         $ref: '#/components/schemas/RolePermission'
 *                     message:
 *                       example: "Successfully fetching"
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   id_role: "550e8400-e29b-41d4-a716-446655440001"
 *                   id_permission: "550e8400-e29b-41d4-a716-446655440002"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "admin"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "admin"
 *                   Permission:
 *                     id: "550e8400-e29b-41d4-a716-446655440002"
 *                     name: "user.read"
 *                 - id: "550e8400-e29b-41d4-a716-446655440003"
 *                   id_role: "550e8400-e29b-41d4-a716-446655440001"
 *                   id_permission: "550e8400-e29b-41d4-a716-446655440004"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "admin"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "admin"
 *                   Permission:
 *                     id: "550e8400-e29b-41d4-a716-446655440004"
 *                     name: "user.create"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong. Please try again in a moment."
 *               error: "Database connection error"
 * 
 * /api/user-management/rolepermissions/select:
 *   get:
 *     summary: Get simplified list of role permissions for dropdown/select components
 *     description: |
 *       Retrieve a simplified list of role permissions with optional search functionality.
 *       This endpoint is designed for use in dropdown menus, select components, or
 *       other UI elements that need a list of role-permission associations.
 *       The response includes role permission details along with their associated
 *       role and permission information.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Role Permissions
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search by role name (case-insensitive partial match)
 *         required: false
 *         example: "admin"
 *     responses:
 *       200:
 *         description: Successfully retrieved role permissions list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermissionSelectResponse'
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   id_role: "550e8400-e29b-41d4-a716-446655440001"
 *                   id_permission: "550e8400-e29b-41d4-a716-446655440002"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "admin"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "admin"
 *                   Permission:
 *                     id: "550e8400-e29b-41d4-a716-446655440002"
 *                     name: "user.read"
 *                 - id: "550e8400-e29b-41d4-a716-446655440003"
 *                   id_role: "550e8400-e29b-41d4-a716-446655440001"
 *                   id_permission: "550e8400-e29b-41d4-a716-446655440004"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "admin"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "admin"
 *                   Permission:
 *                     id: "550e8400-e29b-41d4-a716-446655440004"
 *                     name: "user.create"
 *               message: "Successfully fetching"
 *               status: 200
 *       401:
 *         description: Unauthorized - No valid access token or session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_token:
 *                 summary: No valid access token
 *                 value:
 *                   message: "Unauthorized: No valid Access Token in cookie or Authorization header"
 *               no_session:
 *                 summary: No valid session
 *                 value:
 *                   message: "Unauthorize request"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong, Please try again in a moment"
 */ 