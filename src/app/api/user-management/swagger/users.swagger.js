/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - id_role
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         username:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Unique username for the user
 *           example: "john.doe"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         created_by:
 *           type: string
 *           description: Username who created the user
 *           example: "admin"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *         updated_by:
 *           type: string
 *           description: Username who last updated the user
 *           example: "admin"
 *         Role:
 *           type: object
 *           description: Associated role for this user
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               example: "admin"
 *     
 *     UserCreateRequest:
 *       type: object
 *       required:
 *         - username
 *         - id_role
 *       properties:
 *         username:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: Unique username for the user
 *           example: "john.doe"
 *         id_role:
 *           type: string
 *           format: uuid
 *           description: Role ID to assign to the user
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *     
 *     UserSelect:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         username:
 *           type: string
 *           description: Username of the user
 *           example: "john.doe"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         created_by:
 *           type: string
 *           description: Username who created the user
 *           example: "admin"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *         updated_by:
 *           type: string
 *           description: Username who last updated the user
 *           example: "admin"
 *         Role:
 *           type: object
 *           description: Associated role for this user
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               example: "admin"
 *     
 *     UserSelectResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserSelect'
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
 * /api/user-management/users:
 *   get:
 *     summary: Get list of users with pagination, sorting, and filtering
 *     description: |
 *       Retrieve a paginated list of users with optional search, sorting, and filtering capabilities.
 *       This endpoint supports:
 *       - **Search**: Filter users by username (case-insensitive)
 *       - **Pagination**: Control page size and navigation
 *       - **Sorting**: Sort by any user field in ascending or descending order
 *       - **Role Filtering**: Filter users by specific role
 *       - **Permissions**: Requires 'user.read' permission
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search users by username (case-insensitive partial match)
 *         required: false
 *         example: "john"
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
 *           enum: [username, role_name, created_at, created_by, updated_at, updated_by]
 *           default: username
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
 *       - in: query
 *         name: id_role
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter users by specific role ID (use 'all' to show all roles)
 *         required: false
 *         example: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
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
 *                         $ref: '#/components/schemas/User'
 *                     message:
 *                       example: "Successfully fetching"
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   username: "john.doe"
 *                   created_at: "2024-01-01T00:00:00.000Z"
 *                   created_by: "admin"
 *                   updated_at: "2024-01-01T00:00:00.000Z"
 *                   updated_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "admin"
 *                 - id: "550e8400-e29b-41d4-a716-446655440002"
 *                   username: "jane.smith"
 *                   created_at: "2024-01-02T00:00:00.000Z"
 *                   created_by: "admin"
 *                   updated_at: "2024-01-02T00:00:00.000Z"
 *                   updated_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440003"
 *                     name: "editor"
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
 *               message: "Forbidden: Insufficient permissions to read users"
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
 *   post:
 *     summary: Create a new user
 *     description: |
 *       Create a new user and assign them to a specific role.
 *       This endpoint:
 *       - Validates username uniqueness
 *       - Validates role existence
 *       - Requires 'user.create' permission
 *       - Provides audit trail (created_by field)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *           example:
 *             username: "john.doe"
 *             id_role: "550e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully added."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               message: "User successfully added."
 *               user:
 *                 id: "550e8400-e29b-41d4-a716-446655440004"
 *                 username: "john.doe"
 *                 id_role: "550e8400-e29b-41d4-a716-446655440001"
 *                 created_at: "2024-01-03T00:00:00.000Z"
 *                 created_by: "admin"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Invalid input."
 *       401:
 *         description: Unauthorized - no valid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized: No valid JWT token"
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Forbidden: Insufficient permissions to create users"
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Selected role does not exist. Someone might have deleted it already."
 *       409:
 *         description: Conflict - user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "User Already Registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Oops! Something went wrong. Please try again in a moment."
 * 
 * /api/user-management/users/select:
 *   get:
 *     summary: Get simplified list of users for dropdown/select components
 *     description: |
 *       Retrieve a simplified list of users with optional search functionality.
 *       This endpoint is designed for use in dropdown menus, select components, or
 *       other UI elements that need a list of available users.
 *       The response includes user information along with their associated roles.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search users by username (case-insensitive partial match)
 *         required: false
 *         example: "john"
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSelectResponse'
 *             example:
 *               data:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   username: "john.doe"
 *                   created_at: "2024-01-01T00:00:00.000Z"
 *                   created_by: "admin"
 *                   updated_at: "2024-01-01T00:00:00.000Z"
 *                   updated_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "admin"
 *                 - id: "550e8400-e29b-41d4-a716-446655440002"
 *                   username: "jane.smith"
 *                   created_at: "2024-01-02T00:00:00.000Z"
 *                   created_by: "admin"
 *                   updated_at: "2024-01-02T00:00:00.000Z"
 *                   updated_by: "admin"
 *                   Role:
 *                     id: "550e8400-e29b-41d4-a716-446655440003"
 *                     name: "editor"
 *               message: "Data users successfuly fetch"
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