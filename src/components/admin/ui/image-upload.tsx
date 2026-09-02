'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadService } from '@/lib/services/upload.service';
import { getImageUrl } from '@/lib/utils/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  placeholder = 'https://... or upload file',
  accept = 'image/*',
  label,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await uploadService.uploadFile(file);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const previewUrl = getImageUrl(value);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-[var(--text-secondary)]">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Preview Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Handle broken images
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-[var(--text-secondary)] opacity-50" />
          )}

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              title="Remove image"
              className="absolute top-1 right-1 p-0.5 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition shadow"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Text Input + Upload Button */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setError(null);
                onChange(e.target.value);
              }}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium text-xs border border-blue-500/30 transition disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>

          {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
}
