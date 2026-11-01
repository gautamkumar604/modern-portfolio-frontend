/**
 * Resolves a given image path or URL into a fully-qualified browser loadable URL.
 * Supports:
 * - Direct HTTP/HTTPS URLs (e.g. Unsplash, Cloudinary, Imgur, etc.)
 * - Data URLs and Blob URLs
 * - Protocol-relative URLs (//...)
 * - Domain strings without protocol (e.g. www.example.com or images.unsplash.com/...)
 * - Local uploads and backend static assets (e.g. /uploads/image.png)
 */
export function getImageUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data URLs and Blobs (e.g. client previews)
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Protocol-relative URLs (e.g. //images.unsplash.com/...)
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  // Already an absolute HTTP/HTTPS URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Domain without protocol (e.g. www.example.com or images.unsplash.com)
  if (trimmed.startsWith('www.') || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\//.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Local uploads or backend relative paths (e.g. /uploads/... or uploads/...)
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${apiBase}${cleanPath}`;
}

/**
 * Checks if a given string looks like a direct image URL based on extension or data protocol
 */
export function isLikelyImageUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('data:image/')) return true;
  return /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(trimmed);
}
