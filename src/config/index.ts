const _config = {
  PORT: (process.env.PORT as string) || 8000,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASS: process.env.ADMIN_PASS as string,
  ENV_DEV: false, //TODO: change this into true in production.
};
export const { MONGO_URI, ENV_DEV, JWT_ACCESS_SECRET, PORT } = _config;
