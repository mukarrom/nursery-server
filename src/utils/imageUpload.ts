import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import config from "../config";

interface UploadResult {
  url: string;
  public_id: string;
}

export interface File {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

/**
 * Uploads an image file to Cloudinary
 * @param file - The file buffer or readable stream to upload
 * @param folder - Optional folder to store the image in Cloudinary
 * @returns Promise with upload result containing URL and public_id
 */
export const uploadImage = async (
  file: Buffer | Readable,
  folder?: string
): Promise<UploadResult> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder ? `nitto-vojon/${folder}` : "nitto-vojon",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("Upload failed"));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      if (Buffer.isBuffer(file)) {
        const readable = new Readable();
        readable.push(file);
        readable.push(null);
        readable.pipe(uploadStream);
      } else {
        file.pipe(uploadStream);
      }
    });
  } catch (error) {
    throw new Error(
      `Failed to upload image: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

/**
 * Deletes an image from Cloudinary using its public ID or URL
 * @param imageIdentifier - The public ID or URL of the image to delete
 * @returns Promise that resolves with Cloudinary deletion result
 */
export const deleteImage = async (
  imageIdentifier: string
): Promise<{ result: string }> => {
  try {
    // Extract public ID from URL if necessary
    const publicId = getPublicIdFromUrl(imageIdentifier);
    // const publicId = imageIdentifier.includes("cloudinary.com")
    //   ? imageIdentifier.split("/").pop()?.split(".")[0]
    //   : imageIdentifier;

    if (!publicId) {
      throw new Error("Invalid image identifier");
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

/**
 * Extracts public_id from a Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public_id or null if not a Cloudinary URL
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  const matches = url.match(/upload\/v\d+\/(.+?)(\.\w+)?$/);
  return matches ? matches[1] : null;
};
