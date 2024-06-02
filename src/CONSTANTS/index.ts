import { ISDEVELOPMENT_ENVIRONMENT } from "../config";

const DB_NAME = "V-tube";
const DATA_LIMIT = "50mb";
const OPT_JWT_REFRESH_TOKEN =
  "JLKHGJLHFUTYOIJJKJVGYjdlkfjkdjkdfjdjfkdj-ee1dfjkdff232328787";
const OPT_JWT_ACCESS_TOKEN =
  "jfldjfkdjfJDLKSJKLJFLKJD2343423ejlkddfjlkdjflklsdjjflklsdjklfjsdklfj";
const COOKIES_OPTION = {
  httpOnly: true,
  secure: !ISDEVELOPMENT_ENVIRONMENT && true,
};
export {
  DB_NAME,
  DATA_LIMIT,
  OPT_JWT_ACCESS_TOKEN,
  OPT_JWT_REFRESH_TOKEN,
  COOKIES_OPTION,
};
