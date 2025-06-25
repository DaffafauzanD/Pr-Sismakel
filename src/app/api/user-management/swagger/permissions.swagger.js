/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the permission
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Permission name (e.g., 'user.read', 'role.create')
 *           example: "user.read"
 *         create_date:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the permission was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         create_by:
 *           type: string
 *           description: Username who created the permission
 *           example: "system"
 *         update_date:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the permission was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *         update_by:
 *           type: string
 *           description: Username who last updated the permission
 *           example: "admin"
 *     
 *     PermissionSelect:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the permission
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: Permission name
 *           example: "user.read"
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
 * /api/user-management/permissions:
 *   get:
 *     summary: Get list of permissions with pagination, sorting, and filtering
 *     description: |
 *       Retrieve a paginated list of permissions with optional search, sorting, and filtering capabilities.
 *       This endpoint supports:
 *       - **Search**: Filter permissions by name (case-insensitive)
 *       - **Pagination**: Control page size and navigation
 *       - **Sorting**: Sort by any permission field in ascending or descending order
 *       - **Permissions**: Requires 'permission.read' permission
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search permissions by name (case-insensitive partial match)
 *         required: false
 *         example: "user"
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
 *           enum: [name, create_date, create_by, update_date, update_by]
 *           default: name
 *         description: Field name to sort by
 *         required: false
 *         example: "create_date"
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
 *         description: Successfully retrieved permissions list
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
 *                         $ref: '#/components/schemas/Permission'
 *                     message:
 *                       example: "Successfully fetching"
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "user.read"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "system"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "system"
 *                 - id: "550e8400-e29b-41d4-a716-446655440001"
 *                   name: "user.create"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "system"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "system"
 *                 - id: "550e8400-e29b-41d4-a716-446655440002"
 *                   name: "user.update"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "system"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "system"
 *                 - id: "550e8400-e29b-41d4-a716-446655440003"
 *                   name: "user.delete"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "system"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "system"
 *                 - id: "550e8400-e29b-41d4-a716-446655440004"
 *                   name: "role.read"
 *                   create_date: "2024-01-01T00:00:00.000Z"
 *                   create_by: "system"
 *                   update_date: "2024-01-01T00:00:00.000Z"
 *                   update_by: "system"
 *               pagination:
 *                 total: 5
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
 *               message: "Forbidden: Insufficient permissions"
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
 * /api/user-management/permissions/select:
 *   get:
 *     summary: Get simplified list of permissions for dropdown/select components
 *     description: |
 *       Retrieve a simplified list of all permissions without pagination or filtering.
 *       This endpoint is designed for use in dropdown menus, select components, or
 *       other UI elements that need a simple list of available permissions.
 *       The response includes only essential permission information (ID and name).
 *       Permissions are sorted alphabetically by name for better user experience.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Permissions
 *     responses:
 *       200:
 *         description: Successfully retrieved permissions list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionSelect'
 *             example:
 *               - id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "permission.read"
 *               - id: "550e8400-e29b-41d4-a716-446655440001"
 *                 name: "role.create"
 *               - id: "550e8400-e29b-41d4-a716-446655440002"
 *                 name: "role.delete"
 *               - id: "550e8400-e29b-41d4-a716-446655440003"
 *                 name: "role.read"
 *               - id: "550e8400-e29b-41d4-a716-446655440004"
 *                 name: "role.update"
 *               - id: "550e8400-e29b-41d4-a716-446655440005"
 *                 name: "user.create"
 *               - id: "550e8400-e29b-41d4-a716-446655440006"
 *                 name: "user.delete"
 *               - id: "550e8400-e29b-41d4-a716-446655440007"
 *                 name: "user.read"
 *               - id: "550e8400-e29b-41d4-a716-446655440008"
 *                 name: "user.update"
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