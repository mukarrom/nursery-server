import { File } from "../utils/imageUpload";

declare global {
  namespace Express {
    interface Request {
      file?: File;
    }
  }
}
