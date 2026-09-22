import { api } from './api';

export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.imageUrl;
    } catch (err: any) {
      // Fallback for offline dev / mock testing: return base64 Data URL if backend server is unreachable
      console.warn('Backend upload API error, using local data URL fallback:', err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });
    }
  },
};
