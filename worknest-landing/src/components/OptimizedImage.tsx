import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/imagekit';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  quality = 80,
  className,
  priority = false,
  fill = false,
  sizes,
  format = 'auto',
  ...props
}: OptimizedImageProps) {
  // If it's an external URL or already optimized, use as-is
  if (src.startsWith('http') || src.includes('ik.imagekit.io')) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        fill={fill}
        sizes={sizes}
        {...props}
      />
    );
  }

  // Generate optimized ImageKit URL
  const optimizedSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality,
    format,
  });

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fill={fill}
      sizes={sizes}
      {...props}
    />
  );
}