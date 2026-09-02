export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  uploadFile: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    ).replace(/\/$/, '');

    const response = await fetch(`${apiBase}/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message;
      throw new Error(message || 'File upload failed. Please check file format and size.');
    }

    return response.json();
  },
};
