import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import definitions from './definitions';
import parameters from './parameters';
import schemas from './schemas';
import tags from './tags';

const isDEV = process.env.NODE_ENV === 'development';
const url = `${isDEV ? 'http' : 'https'}://${process.env.URL}${
  process.env.PORT ? `:${process.env.PORT}` : ''
}/api`;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Open APIs',
    version: '1.0.0',
    description: 'Available API endpoints and operations on each endpoint'
  },
  servers: [{ url }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  tags,
  parameters,
  definitions,
  schemas
};

const options = {
  swaggerDefinition,
  apis: [path.resolve(isDEV ? './api/*.js' : './server.api.js')]
};
const swaggerSpec = swaggerJsdoc(options);
const customConfig = {
  withCredentials: true,
  customSiteTitle: 'Open APIs'
  // customCss: '.swagger-ui section.models.is-open { display: none }'
};

export default app => {
  app.use(
    '/apidocs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, customConfig)
  );
};
