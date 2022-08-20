import { ConfigOptions, v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: process.env.CDN_CLOUDNAME,
      api_key: process.env.CDN_API_KEY,
      api_secret: process.env.CDN_API_SECRET,
    });
  },
};
