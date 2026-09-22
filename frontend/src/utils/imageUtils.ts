const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

export function getImageUrl(imagePath?: string): string {
  if (!imagePath || !imagePath.trim()) {
    return DEFAULT_PRODUCT_IMAGE;
  }

  const path = imagePath.trim();

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_ORIGIN}${cleanPath}`;
}
