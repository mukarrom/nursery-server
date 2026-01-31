import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT || 8050,
  MONGO_URI: process.env.MONGO_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "360",
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  smtpUserName: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  clientUrl: process.env.CLIENT_URL,
};
