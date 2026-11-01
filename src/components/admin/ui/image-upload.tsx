'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Globe,
} from 'lucide-react';
import { uploadService } from '@/lib/services/upload.service';
import { getImageUrl } from '@/lib/utils/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  helpText?: string;
}

export function ImageUpload({
  value,
  onChange,
  placeholder = 'https://images.unsplash.com/... or upload from storage',
  accept = 'image/*',
  label,
  aspectRatio = 'square',
  helpText,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgLoadError, setImgLoadError] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adjust state when value prop changes without cascading effect renders
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setImgLoadError(false);
    setError(null);
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate mime type
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, GIF, SVG).');
      return;
    }

    setUploading(true);
    setUploadProgress(`Uploading ${file.name}...`);
    setError(null);

    try {
      const res = await uploadService.uploadFile(file);
      onChange(res.url);
      setUploadProgress(null);
    } catch (err: any) {
      setError(err.message || 'File upload failed. Please try again.');
      setUploadProgress(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    setImgLoadError(false);
  };

  const previewUrl = value ? getImageUrl(value) : '';
  const isStorageUpload = value?.startsWith('/uploads/') || value?.startsWith('uploads/');
  const isExternalUrl = value?.startsWith('http://') || value?.startsWith('https://');

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
            {label}
          </label>
          {helpText && (
            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
              {helpText}
            </span>
          )}
        </div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'upload'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Upload from Storage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTab === 'url'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Image URL Link</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* TAB 1: Storage Upload Zone */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition flex flex-col items-center justify-center space-y-3 ${
            isDragOver
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-blue-500/40'
          }`}
        >
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-blue-400 shadow-sm">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            ) : (
              <Upload className="w-6 h-6 text-blue-400" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              {uploading
                ? uploadProgress || 'Uploading file to storage...'
                : 'Drag & drop your image here, or browse from storage'}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Supports PNG, JPG, WebP, GIF, SVG (Up to 10 MB)
            </p>
          </div>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5" />
                <span>Choose File from Storage</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* TAB 2: Direct URL Input */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setError(null);
                  onChange(e.target.value);
                }}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 outline-none pr-8"
              />
              {value && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute right-2.5 top-2.5 text-[var(--text-secondary)] hover:text-rose-400"
                  title="Clear URL"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold transition shrink-0 cursor-pointer"
              title="Upload from device instead"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Or Upload File</span>
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Enter a direct image link (e.g. Unsplash, Imgur, Cloudinary, etc.)
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Preview Card */}
      {value ? (
        <div className="p-3.5 rounded-2xl card-surface border border-[var(--border-color)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--text-primary)]">Current Image Preview</span>
              {isStorageUpload && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  Stored on Server
                </span>
              )}
              {isExternalUrl && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/60 text-[10px] font-mono">
                  <Globe className="w-3 h-3" />
                  External Web URL
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isExternalUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-blue-400 hover:bg-[var(--bg-primary)] transition"
                  title="Open original image link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold transition"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Visual Container */}
          <div
            className={`relative rounded-xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center ${
              aspectRatio === 'video'
                ? 'w-full aspect-[16/9] max-h-64'
                : aspectRatio === 'square'
                ? 'w-24 h-24 sm:w-28 sm:h-28'
                : 'w-full h-40'
            }`}
          >
            {imgLoadError ? (
              <div className="p-4 text-center space-y-1.5 text-[var(--text-secondary)]">
                <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto" />
                <p className="text-xs font-semibold text-amber-300">
                  Image Preview Unavailable
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] max-w-sm">
                  The provided URL could not be loaded as an image. If you provided a web URL, please ensure it points directly to an image file (e.g. ending in .png, .jpg, .webp) rather than an HTML webpage.
                </p>
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="Upload preview"
                referrerPolicy="no-referrer"
                onError={() => setImgLoadError(true)}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="text-[11px] text-[var(--text-secondary)] font-mono truncate" title={value}>
            Path: {value}
          </p>
        </div>
      ) : null}
    </div>
  );
}
