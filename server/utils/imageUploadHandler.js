import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import errorHandler from './errorHandler';

dotenv.config();

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadImage = file =>
  new Promise((resolve, reject) => {
    if (file.size > 250 * 1000 || !file.mimetype.includes('image/jpeg')) {
      reject(errorHandler(400, 'Only .jpg images less than 250kb are allowed'));
    }
    cloudinary.v2.uploader
      .upload_stream({ resource_type: 'image', folder: 'store', use_filename: true }, (error, result) => {
        if (error) {
          const err = new Error();
          err.message = error.message;
          err.status = error.http_code;
          reject(err);
          return;
        }
        resolve(result.secure_url);
      })
      .end(file.buffer);
  });

const deleteImage = imageUrl =>
  new Promise(resolve => {
    const publicId = imageUrl
      .split('/')
      .splice(7)
      .join('/')
      .split('.jpg')
      .join('');
    cloudinary.v2.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
      resolve(result);
    });
  });
export { uploadImage, deleteImage };
