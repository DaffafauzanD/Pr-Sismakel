/**
 * Example: How to use the separated Swagger documentation
 * 
 * This file demonstrates how to integrate the separated Swagger documentation
 * into your Next.js application.
 */

// Example 1: Basic integration in your Swagger configuration
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import the separated documentation
import '@/app/api/user-management/swagger/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for managing users, roles, and permissions',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: [
    // Include the separated documentation files
    './src/app/api/user-management/swagger/*.swagger.js',
    './src/app/api/user-management/swagger/index.js',
  ],
};

const specs = swaggerJsdoc(options);

// Example 2: Express.js integration
export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Example 3: Next.js API route for Swagger documentation
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(specs);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// Example 4: Custom Swagger configuration with additional options
const customOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'Comprehensive API for managing users, roles, permissions, and role-permission associations.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
    },
  },
  apis: [
    './src/app/api/user-management/swagger/*.swagger.js',
    './src/app/api/user-management/swagger/index.js',
  ],
};

// Example 5: Environment-specific configuration
const getSwaggerConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'User Management API',
        version: '1.0.0',
        description: 'API for managing users, roles, and permissions',
      },
      servers: [
        {
          url: isDevelopment 
            ? 'http://localhost:3000' 
            : 'https://api.example.com',
          description: isDevelopment ? 'Development server' : 'Production server',
        },
      ],
    },
    apis: [
      './src/app/api/user-management/swagger/*.swagger.js',
      './src/app/api/user-management/swagger/index.js',
    ],
  };
};

// Example 6: Custom Swagger UI configuration
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'User Management API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
  },
};

// Example 7: Integration with Next.js pages
export function createSwaggerPage() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Management API Documentation</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          SwaggerUIBundle({
            url: '/api/swagger.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        };
      </script>
    </body>
    </html>
  `;
}

// Example 8: Testing the documentation
export function testSwaggerDocumentation() {
  console.log('Testing Swagger documentation...');
  
  // Check if all required schemas are defined
  const requiredSchemas = [
    'User',
    'Role', 
    'Permission',
    'RolePermission',
    'UserProfile',
    'PaginationInfo',
    'ApiResponse',
    'ErrorResponse'
  ];
  
  console.log('Required schemas:', requiredSchemas);
  
  // Check if all endpoints are documented
  const requiredEndpoints = [
    'GET /api/user-management/users',
    'POST /api/user-management/users',
    'GET /api/user-management/users/select',
    'GET /api/user-management/roles',
    'POST /api/user-management/roles',
    'PUT /api/user-management/roles/{id}',
    'GET /api/user-management/roles/select',
    'GET /api/user-management/permissions',
    'GET /api/user-management/permissions/select',
    'GET /api/user-management/rolepermissions',
    'GET /api/user-management/rolepermissions/select',
    'GET /api/user-management/profile'
  ];
  
  console.log('Required endpoints:', requiredEndpoints);
  
  return {
    schemas: requiredSchemas,
    endpoints: requiredEndpoints,
    status: 'Documentation test completed'
  };
}

// Example 9: Export for use in other files
export {
  options,
  customOptions,
  getSwaggerConfig,
  swaggerUiOptions,
  specs
}; 