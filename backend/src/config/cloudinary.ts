import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

// Cloudinary se configura solo si se proveen credenciales en el .env.
// Si no están configuradas, la función isCloudinaryConfigured() devuelve false
// y los endpoints de subida responden con un error claro.
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export const isCloudinaryConfigured = () =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

export async function uploadImage(buffer: Buffer, options?: { folder?: string; publicId?: string }) {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary no está configurado. Añade CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET al .env.');
  }

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder ?? 'ecommerce/products',
        public_id: options?.publicId,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary no devolvió resultado'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

export default cloudinary;