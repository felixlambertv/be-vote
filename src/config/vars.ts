import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

export const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  dbUrl: process.env.DB_URL!,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY!,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY!,
};
