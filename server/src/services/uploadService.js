import cloudinary from '../config/cloudinary.js';

export const uploadBufferToCloudinary = async (file) => {
  if (!file) {
    return '';
  }

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'demo') {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'zerofoodwaste',
          resource_type: 'image',
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );

      uploadStream.end(file.buffer || file);
    });

    return result.secure_url;
  }

  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};
