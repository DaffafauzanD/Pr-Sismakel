import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Docs',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['src/**/route.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return new Response(JSON.stringify(swaggerSpec), {
    headers: { 'Content-Type': 'application/json' },
  });
}