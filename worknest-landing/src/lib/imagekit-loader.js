export default function imagekitLoader({ src, width, quality }) {
  if (src[0] === '/') src = src.slice(1);
  
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  
  const paramsString = params.join(',');
  var urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  
  if (urlEndpoint[urlEndpoint.length - 1] === '/') urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  
  return `${urlEndpoint}/${src}?tr=${paramsString}`;
}