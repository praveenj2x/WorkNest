import ImageKit from 'imagekit-javascript';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;

// Helper function to generate optimized image URLs
export function getOptimizedImageUrl(src, options = {}) {
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    progressive = true,
  } = options;

  const transformations = [];
  
  if (width) transformations.push(`w-${width}`);
  if (height) transformations.push(`h-${height}`);
  if (quality) transformations.push(`q-${quality}`);
  if (format) transformations.push(`f-${format}`);
  if (progressive) transformations.push('pr-true');

  const transformString = transformations.join(',');
  
  return imagekit.url({
    path: src,
    transformation: [{
      raw: transformString
    }]
  });
}