import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET(req) {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', 
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Sismakel',
        version: '1.0',
      },
      components:{
        securitySchemes:{
          bearerAuth:{
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security:[{
        bearerAuth: []
      }]
    },
  });
  return new Response(JSON.stringify(spec), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}