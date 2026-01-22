import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

const sendImageToCloudinary = (
    imageName: string,
    path: string
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            {
                public_id: imageName,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result as UploadApiResponse);
                }
            }
        );
    });
};

export default sendImageToCloudinary;

