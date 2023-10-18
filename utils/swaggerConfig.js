import dotenv from 'dotenv';
dotenv.config();

const URL_LOCAL = 'http://localhost:3000';
const URL_SERVER = process.env.SERVER_ADDRESS;

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quick Bucks Wallet API',
      version: '1.0.0',
      description: 'API documentation for My Wallet app',
    },
    servers: [
      {
        url: URL_SERVER,
        description: 'Cyclic server',
      },
      {
        url: URL_LOCAL,
        description: 'Local server',
      },
    ],
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Enter your Bearer token in the format "Bearer {token}"',
      },
    },
  },
  apis: ['../routes/api/*.js', '../controllers/*.js'],
};
