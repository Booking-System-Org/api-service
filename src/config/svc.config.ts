import { registerAs } from '@nestjs/config';
import { AppConfig } from './types';

export default registerAs(
  'service',
  (): AppConfig => ({
    appPort: process.env.APP_PORT || '3000',
    appEnv: process.env.NODE_ENV || 'development',
  }),
);
