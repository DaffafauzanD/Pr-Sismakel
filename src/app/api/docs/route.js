import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET(req) {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', 
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Sismakel',
        version: '1.0',
        description: 'API Documentation untuk Sistem Manajemen Keuangan (Sismakel)',
        contact: {
          name: 'Sismakel Support',
          email: 'support@sismakel.com'
        }
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Masukkan JWT token yang didapat dari endpoint /api/auth/login"
          },
        },
        schemas: {
          LoginRequest: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {
                type: 'string',
                example: 'admin'
              },
              password: {
                type: 'string',
                format: 'password',
                example: 'password'
              }
            }
          },
          LoginResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: true
              },
              message: {
                type: 'string',
                example: 'Login berhasil'
              },
              data: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                    description: 'JWT token untuk autentikasi'
                  },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                      id_role: { type: 'string' },
                      roleName: { type: 'string' },
                      permissions: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                example: false
              },
              message: {
                type: 'string',
                example: 'Error message'
              }
            }
          }
        }
      },
      security: [{
        bearerAuth: []
      }],
      tags: [
        {
          name: 'Auth',
          description: 'Endpoint untuk autentikasi dan otorisasi'
        },
        {
          name: 'User',
          description: 'Endpoint untuk manajemen user'
        },
        {
          name: 'Role Permissions',
          description: 'Endpoint untuk manajemen role dan permission'
        }
      ]
    },
  });
  return new Response(JSON.stringify(spec), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}