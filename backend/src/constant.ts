import * as dotenv from "dotenv";

dotenv.config();

const PORT: number = parseInt(process.env.PORT) || 8000;

// DATABASE
const DATABASE = {
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  pass: process.env.DB_PASS!,
  dbname: process.env.DB_NAME!,
};

// KHALTI
const KHALTI = {
  secret_key: process.env.LIVE_SECRET_KEY!,
  public_key: process.env.LIVE_PUBLIC_KEY!,
  gateway_uri: process.env.KHALTI_GATEWAY_URI!,
};

const ESEWA = {
  secret_key: process.env.ESEWA_SECRET_KEY!,
  product_code: process.env.ESEWA_PRODUCT_CODE!,
  gateway_url: process.env.ESEWA_GATEWAY_URL!,
};

// URLs
const SERVER = {
  backend: process.env.BACKEND_URL,
};

export { DATABASE, ESEWA, KHALTI, PORT, SERVER };
