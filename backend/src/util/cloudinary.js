import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary() {
  if (!process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
    console.warn('Cloudinary not configured. Set CLOUDINARY_URL or individual env vars.');
    return;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadBufferToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, public_id: filename, resource_type: 'auto' }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}


