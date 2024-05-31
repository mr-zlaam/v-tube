import { OPT_JWT_ACCESS_TOKEN, OPT_JWT_REFRESH_TOKEN } from "../CONSTANTS";

const _config = {
  PORT: (process.env.PORT as string) || 8000,
  MONGO_URI: process.env.MONGO_URI as string,
  JWT_ACCESS_SECRET:
    (process.env.ACCESS_TOKEN_SECRET as string) || OPT_JWT_ACCESS_TOKEN,
  JWT_REFRESH_SECRET:
    (process.env.REFRESH_TOKEN_SECRET as string) || OPT_JWT_REFRESH_TOKEN,
  JWT_ACCESS_EXPIRE: process.env.ACCESS_TOKEN_EXPIRY as string,
  JWT_REFRESH_EXPIRE: process.env.ACCESS_TOKEN_EXPIRY as string,
  ISDEVELOPMENT_ENVIRONMENT: true, //TODO: change this into false in production.
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,
  CLOUDINARY_NAME: process.env.NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
};
export const {
  MONGO_URI,
  ISDEVELOPMENT_ENVIRONMENT,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  PORT,
  CORS_ORIGIN,
  JWT_ACCESS_EXPIRE,
  JWT_REFRESH_EXPIRE,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = _config;
