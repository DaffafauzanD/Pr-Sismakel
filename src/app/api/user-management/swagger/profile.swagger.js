/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         username:
 *           type: string
 *           description: Username of the authenticated user
 *           example: "john.doe"
 *         role:
 *           type: object
 *           description: Role information for the user
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "550e8400-e29b-41d4-a716-446655440001"
 *             name:
 *               type: string
 *               example: "admin"
 *         permissions:
 *           type: array
 *           description: List of permission names assigned to the user's role
 *           items:
 *             type: string
 *           example: ["user.read", "user.create", "role.read"]
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 *     
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/UserProfile'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *           example: false
 *         message:
 *           type: string
 *           description: Error message
 * 
 * /api/user-management/profile:
 *   get:
 *     summary: Get current user profile information
 *     description: |
 *       Retrieve detailed profile information for the currently authenticated user.
 *       This endpoint:
 *       - Returns user's basic information (ID, username)
 *       - Includes role details (role ID and name)
 *       - Lists all permissions assigned to the user's role
 *       - Shows creation and update timestamps
 *       - Uses JWT token from request headers for authentication
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Profile
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 username: "john.doe"
 *                 role:
 *                   id: "550e8400-e29b-41d4-a716-446655440001"
 *                   name: "admin"
 *                 permissions:
 *                   - "user.read"
 *                   - "user.create"
 *                   - "user.update"
 *                   - "user.delete"
 *                   - "role.read"
 *                   - "role.create"
 *                   - "role.update"
 *                   - "role.delete"
 *                   - "permission.read"
 *                 created_at: "2024-01-01T00:00:00.000Z"
 *                 updated_at: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - User not found or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "User tidak ditemukan"
 *       404:
 *         description: User not found in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "User tidak ditemukan"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */ 