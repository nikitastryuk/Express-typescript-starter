import { Router } from 'express';

import swaggerUiExpress from 'swagger-ui-express';
import openapiJson from '../../../specification/openapi.json';

export const DocumentationRouter = (): Router => {
  return Router().use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(openapiJson));
};
