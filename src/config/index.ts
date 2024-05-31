const _config = {
  PORT: (process.env.PORT as string) || 8000,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASS: process.env.ADMIN_PASS as string,
  ISDEVELOPMENT_ENVIRONMENT: true, //TODO: change this into false in production.
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,
};
export const {
  MONGO_URI,
  ISDEVELOPMENT_ENVIRONMENT,
  JWT_ACCESS_SECRET,
  PORT,
  CORS_ORIGIN,
} = _config;
