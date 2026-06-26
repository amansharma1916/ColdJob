import cloudinary from '../config/cloudinary.js';

export const uploadFile = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'cold-email-platform/resumes',
        filename: options.filename,
        resource_type: options.resourceType || 'auto',
        format: options.format || 'pdf',
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          bytes: result.bytes,
          format: result.format,
          resource_type: result.resource_type,
        });
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFile = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};